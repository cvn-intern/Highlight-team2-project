import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthorizeJWT implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private logger: Logger = new Logger(AuthorizeJWT.name),
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.header('Authorization');
    const jwtToken = authHeader && authHeader.split(' ')[1];
    const isInBlocklist = await this.userService.checkAccessTokenOfUserInBlocklist(jwtToken);
    if (isInBlocklist) {
      return false;
    }

    try {
      const secret = this.configService.get<string>('JWT_ACCESSKEY');
      const payload = await this.jwtService.verify(jwtToken, { secret: secret });
      const currentUser = await this.userService.getUserById(payload.id);

      if (!currentUser) {
        return false;
      }

      request.idUser = currentUser.id;

      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
