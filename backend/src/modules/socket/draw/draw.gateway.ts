import { SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { AbstractGateway } from '../shared/abstract.gateway';
import { Server, Socket } from 'socket.io';

export class DrawGateway extends AbstractGateway {

  @SubscribeMessage('start-drawing')
  handleStartDrawing(client: Socket, data: any): void {
    
    
    client.broadcast.emit('other-start-drawing', data)
  }


  @SubscribeMessage('drawing')
  handleDrawing(client: Socket, data: any): void {
    console.log(data);
    client.broadcast.emit('other-drawing', data)
  } 

  @SubscribeMessage('finish-drawing')
  handleFinishDrawing(client: Socket, data: any): void {
    client.broadcast.emit('other-finish-drawing')
  }

}
