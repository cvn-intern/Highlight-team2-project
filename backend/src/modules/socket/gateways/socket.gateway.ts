import { Logger, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from '../socket.service';

@WebSocketGateway(Number.parseInt(process.env.SOCKET_PORT || "3001"), { cors: '*:*' })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private socketService: SocketService,
  ) { }

  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('SocketGateway');

  // client ngắt kết nối
  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected!`);
  }

  // client kết nối
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client ${client.id} connected!`);
  }

  afterInit(server: any) {
  }
}