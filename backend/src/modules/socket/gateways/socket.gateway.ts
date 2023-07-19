import {
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketService } from '../socket.service';
import { UserService } from '../../user/user.service';
import { RedisService } from '../../redis/redis.service';
import { RoomUserService } from '../../../modules/room-user/roomUser.service';
import { ConfigService } from '@nestjs/config';
import { RoomService } from 'src/modules/room/room.service';
import { AuthorizeSocket } from 'src/common/guards/authorizeSocket';

const configService: ConfigService = new ConfigService();
const SOCKET_PORT = 3001;

@WebSocketGateway(SOCKET_PORT, {
  cors: true,
})
@UseGuards(AuthorizeSocket)
export class SocketGateway  {
  constructor(
    public socketService: SocketService,
    public userService: UserService,
    public redisService: RedisService,
    public roomUserService: RoomUserService,
    public roomService: RoomService,
    public logger: Logger = new Logger(SocketGateway.name),
  ) {}

  @WebSocketServer() public server: Server;
}
