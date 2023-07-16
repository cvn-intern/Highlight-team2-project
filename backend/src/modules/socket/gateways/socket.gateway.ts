import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from '../socket.service';
import { UserService } from '../../user/user.service';
import { RedisService } from '../../redis/redis.service';
import { extractIdRoom } from '../../../common/utils/helper';
import { RoomUserService } from '../../../modules/room-user/roomUser.service';
import { ConfigService } from '@nestjs/config';
import { LOGOUT_ICON, TEXT_RED } from '../constant';
import { RoomService } from 'src/modules/room/room.service';
import { WebsocketExceptionsFilter } from '../socket.filter';
import { AuthorizeSocket } from 'src/common/guards/authorizeSocket';

const configService: ConfigService = new ConfigService();
const SOCKET_PORT = 3001;

@WebSocketGateway(SOCKET_PORT, {
  cors: {
    origin: configService.get<string>('FRONTEND_URL'),
  },
})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(AuthorizeSocket)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    public socketService: SocketService,
    public userService: UserService,
    public redisService: RedisService,
    public roomUserService: RoomUserService,
    public roomService: RoomService,
    public logger: Logger = new Logger(SocketGateway.name),
  ) { }

  @WebSocketServer() public server: Server;

  async handleDisconnect(
    @ConnectedSocket() client: any,
  ) {
    try {
      this.socketService.removeClientDisconnection(client);
  
      const payload = await this.socketService.extractPayload(client);
  
      if (!payload) {
        this.logger.warn(`${client.id} invalid credential!`);
        return;
      }
  
      const user = await this.userService.getUserById(payload.id);
  
      if (user) {
        const codeRoom = await this.redisService.getObjectByKey(`USER:${user.id}:ROOM`);
  
        client.leave(codeRoom);
  
        if (codeRoom !== null) {
          const idRoom = extractIdRoom(codeRoom);
          await this.roomUserService.deleteRoomUser(idRoom, user.id);
        }
  
        this.server.in(codeRoom).emit(codeRoom, {
          user: user.nickname,
          content: 'left',
          type: TEXT_RED,
          icon: LOGOUT_ICON,
        })
        await this.redisService.deleteObjectByKey(`USER:${user.id}:ROOM`);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  handleConnection(
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.socketService.storeClientConnection(client);
    } catch (error) {
      this.logger.error(error);      
    }
  }
}