import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketGateway } from './socket.gateway';
import {
  DRAWING_CHANNEL,
  FINISH_DRAWING_CHANNEL,
  CLEAR_CANVAS_CHANNEL,
  START_DRAWING_CHANNEL,
  DRAWER_START_DRAWING,
  DRAWER_DRAWING,
  DRAWER_FINISH_DRAWING,
  DRAWER_CLEAR_CANVAS,
  NEW_PLAYER_CHANNEL,
  CANVAS_STATE_CHANNEL,
  GET_CANVAS_STATE,
  CANVAS_STATE_FROM_SERVER,
} from '../constant';
import { Drawing, GetCanvasState, StartDraw } from '../types/drawBody';

interface Clients {
  socketId: string;
  data: Set<string>;
}

export class DrawGateway extends SocketGateway {
  @SubscribeMessage(START_DRAWING_CHANNEL)
  handleStartDrawing(@MessageBody() data: StartDraw, @ConnectedSocket() client: Socket): void {
    const { codeRoom, ...drawData } = data;
    client.broadcast.to(codeRoom).emit(DRAWER_START_DRAWING, drawData);
  }

  @SubscribeMessage(DRAWING_CHANNEL)
  handleDrawing(@MessageBody() data: Drawing, @ConnectedSocket() client: Socket): void {
    const { codeRoom, ...drawData } = data;
    client.broadcast.to(codeRoom).emit(DRAWER_DRAWING, drawData);
  }

  @SubscribeMessage(FINISH_DRAWING_CHANNEL)
  handleFinishDrawing(@MessageBody() codeRoom: string, @ConnectedSocket() client: Socket): void {
    client.broadcast.to(codeRoom).emit(DRAWER_FINISH_DRAWING);
  }

  @SubscribeMessage(CLEAR_CANVAS_CHANNEL)
  handleResetCanvas(@MessageBody() codeRoom: string, @ConnectedSocket() client: Socket): void {
    client.broadcast.to(codeRoom).emit(DRAWER_CLEAR_CANVAS);
  }

  @SubscribeMessage(NEW_PLAYER_CHANNEL)
  handleNewPlayer(@MessageBody() codeRoom: string, @ConnectedSocket() client: Socket): void {
    const roomSockets = this.server.of('/').in(codeRoom);
    const listClients: Clients[] = Array.from(roomSockets[`adapter`].sids);

    const inRoomClient = listClients.find((item: Clients) => {
      const [roomId] = Array.from(item[1].values());
      return !!roomId;
    });
    if (listClients.length > 1 && inRoomClient) {
      client.broadcast.to(inRoomClient[0]).emit(GET_CANVAS_STATE, client.id);
    }
  }

  @SubscribeMessage(CANVAS_STATE_CHANNEL)
  handleGetCanvasState(@MessageBody() data: GetCanvasState, @ConnectedSocket() client: Socket): void {
    const { dataImg, id } = data;
    client.to(id).emit(CANVAS_STATE_FROM_SERVER, dataImg);
  }
}
