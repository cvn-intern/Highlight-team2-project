import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketGateway } from './socket.gateway';
import { DRAWING_CHANNEL, FINISH_DRAWING_CHANNEL, CLEAR_CANVAS_CHANNEL, START_DRAWING_CHANNEL } from '../constant';
import { Drawing, StartDraw } from '../types/drawBody';


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

  @SubscribeMessage(CLEAR_CANVAS_CHANNEL)
  handleResetCanvas(
    @ConnectedSocket() client: Socket,
  ): void {
    client.broadcast.emit('other-clear-canvas')
  }

  @SubscribeMessage('new-player')
  handleNewPlayer(
    @ConnectedSocket() client: Socket,
  ): void {
    client.broadcast.emit('get-other-canvas-state', client.id)
  }

  @SubscribeMessage('canvas-state')
  handleGetCanvasState(
    @MessageBody() {dataImg, id}: any,
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.to(id).emit('canvas-state-from-server', dataImg)
  }
  
}