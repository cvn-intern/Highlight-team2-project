import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketGateway } from './socket.gateway';
import { DRAWING_CHANNEL, FINISH_DRAWING_CHANNEL, RESET_CANVAS_CHANNEL, START_DRAWING_CHANNEL } from '../constant';

interface Point{
  x: number;
  y: number;
};

export type RGBAColorType = {
  r: number;
  g: number;
  b: number;
  a: number;
};

interface StartDraw{
  point: Point,
  color: RGBAColorType,
  penStyle: string,
  brushSize: number,
}

interface Drawing{
  currentPoint: Point,
  color: RGBAColorType,
  penStyle: string,
  isFill: boolean,
}

export class DrawGateway extends SocketGateway {
  @SubscribeMessage(START_DRAWING_CHANNEL)
  handleStartDrawing(
    @MessageBody() data: StartDraw,
    @ConnectedSocket() client: Socket,
  ): void {
    client.broadcast.emit('other-start-drawing', data)
  }

  @SubscribeMessage(DRAWING_CHANNEL)
  handleDrawing(
    @MessageBody() data: Drawing,
    @ConnectedSocket() client: Socket,
  ): void {
    client.broadcast.emit('other-drawing', data)
  } 

  @SubscribeMessage(FINISH_DRAWING_CHANNEL)
  handleFinishDrawing(
    @ConnectedSocket() client: Socket,
  ): void {
    client.broadcast.emit('other-finish-drawing')
  }

  @SubscribeMessage(RESET_CANVAS_CHANNEL)
  handleResetCanvas(
    @ConnectedSocket() client: Socket,
  ): void {
    client.broadcast.emit('reset-canvas')
  }
}