import { SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketGateway } from './socket.gateway';

export class DrawGateway extends SocketGateway {

  @SubscribeMessage('start-drawing')
  handleStartDrawing(client: Socket, data: any): void {
    console.log(data);
    client.broadcast.emit('other-start-drawing', data)
  }

  @SubscribeMessage('drawing')
  handleDrawing(client: Socket, data: any): void {
    console.log(data);
    client.broadcast.emit('other-drawing', data)
  } 

  @SubscribeMessage('finish-drawing')
  handleFinishDrawing(client: Socket, data: any): void {
    console.log(data);
    
    client.broadcast.emit('other-finish-drawing')
  }

}