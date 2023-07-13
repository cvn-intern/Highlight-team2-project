import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class AuthorizeJWT implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private logger: Logger = new Logger(AuthorizeJWT.name),
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.header('Authorization');
    const jwtToken = authHeader && authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verify(jwtToken, {
        secret: this.configService.get<string>('JWT_ACCESSKEY'),
      });

      const curUser = await this.userService.getUserById(payload.id);

      if (curUser) {
        request.idUser = curUser.id;
      }

      return curUser ? true : false;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}