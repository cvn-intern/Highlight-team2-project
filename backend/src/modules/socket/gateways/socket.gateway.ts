import { Logger, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from '../socket.service';
import { UserService } from 'src/modules/user/user.service';

@WebSocketGateway(3001, { cors: '*:*' })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    public socketService: SocketService,
    public userService: UserService,
  ) { }

  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('SocketGateway');

  // client ngắt kết nối
  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected!`);
    this.socketService.removeClientDisconnection(client);
  }

  // client kết nối
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client ${client.id} connected!`);
    this.socketService.storeClientConnection(client);
  }

  afterInit(server: any) {
  }
}