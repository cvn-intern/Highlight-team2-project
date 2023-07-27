import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WsException,
} from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import { SocketClient } from '../socket.class';
import { GAME_PLAY, GAME_START_CHANNEL } from '../constant';
import { errorsSocket } from 'src/common/errors/errorCode';

export class GameGateway extends SocketGateway {
  @SubscribeMessage(GAME_START_CHANNEL)
  async handleStartGame(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: SocketClient,
  ) {
    const room = await this.roomService.getRoomByCodeRoom(codeRoom);

    if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);

    let roundOfRoom = await this.roomRoundService.getRoundOfRoom(room.id);
    if (roundOfRoom) {
      roundOfRoom = await this.roomRoundService.updateRoomRound({...roundOfRoom});
    } else {
      roundOfRoom = await this.roomService.initRoomRound(room);
    }
    
    this.server.in(codeRoom).emit(GAME_PLAY, roundOfRoom);
  }
}
