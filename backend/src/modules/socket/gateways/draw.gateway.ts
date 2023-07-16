import { SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketGateway } from './socket.gateway';
import { DRAWING_CHANNEL, FINISH_DRAWING_CHANNEL, START_DRAWING_CHANNEL } from '../constant';

export class DrawGateway extends SocketGateway {

  @SubscribeMessage(START_DRAWING_CHANNEL)
  handleStartDrawing(client: Socket, data: any): void {
    client.broadcast.emit('other-start-drawing', data)
  }

  @SubscribeMessage(DRAWING_CHANNEL)
  handleDrawing(client: Socket, data: any): void {
    client.broadcast.emit('other-drawing', data)
  } 

  @SubscribeMessage(FINISH_DRAWING_CHANNEL)
  handleFinishDrawing(client: Socket, data: any): void {
    client.broadcast.emit('other-finish-drawing')
  }

}