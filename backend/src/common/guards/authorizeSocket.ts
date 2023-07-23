import { CanActivate, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { SocketService } from "src/modules/socket/socket.service";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class AuthorizeSocket implements CanActivate {

  constructor(
    private userService: UserService,
    private logger: Logger = new Logger(AuthorizeSocket.name),
    private jwtService: JwtService,
    private configService: ConfigService,
    private socketService: SocketService,
  ) { }

  async canActivate(
    context: any,
  ): Promise<boolean> {
    const  client = context.args[0];

    const isBlock = await this.socketService.checkInBlockList(client);
    
    if(isBlock) {
      return false;
    }

    const jwtToken: string = context.args[0].handshake.headers.authorization;

    try {
      const payload = await this.jwtService.verify(jwtToken, {
        secret: this.configService.get<string>('JWT_ACCESSKEY'),
      });

      const curUser = await this.userService.getUserById(payload.id);

      if (curUser) {
        client.user =  curUser;
      }

      return curUser ? true : false;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}