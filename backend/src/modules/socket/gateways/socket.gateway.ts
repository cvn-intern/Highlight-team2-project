import { Logger, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from '../socket.service';
import { UserService } from '../../user/user.service';
import { RedisService } from '../../redis/redis.service';
import { extractIdRoom } from '../../../common/utils/helper';
import { RoomUserService } from '../../../modules/room-user/roomUser.service';

@WebSocketGateway(3001, { cors: '*:*' })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    public socketService: SocketService,
    public userService: UserService,
    public redisService: RedisService,
    public roomUserService: RoomUserService,
  ) { }

  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('SocketGateway');

  // client ngắt kết nối
  async handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected!`);
    this.socketService.removeClientDisconnection(client);

    const payload = await this.socketService.extractPayload(client);
    const user = await this.userService.getUserById(payload.id);
    if(user) {
      const codeRoom = await this.redisService.getObjectByKey(`USER:${user.id}:ROOM`);

      client.leave(codeRoom);
  
      if(codeRoom !== null) {
        const idRoom = extractIdRoom(codeRoom);
        await this.roomUserService.deleteRoomUser(idRoom, user.id);
      }
  
      this.server.in(codeRoom).emit(`${codeRoom}-leave`, {
        user: user.nickname,
        content: 'left',
        type: 'text-red-600',
        icon: 'LogOut',
      })
      await this.redisService.deleteObjectByKey(`USER:${user.id}:ROOM`);
    }
  }

  // client kết nối
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client ${client.id} connected!`);
    this.socketService.storeClientConnection(client);
  }

  afterInit(server: any) {
  }
}