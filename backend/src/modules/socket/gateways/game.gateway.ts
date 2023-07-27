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
import { RoomRoundInterface } from 'src/modules/room-round/roomRound.interface';

export class GameGateway extends SocketGateway {
  @SubscribeMessage(GAME_START_CHANNEL)
  async handleStartGame(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: SocketClient,
  ) {
    const room = await this.roomService.getRoomByCodeRoom(codeRoom);
    if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);
    const roomId = room.id;
    const roomRoundIsExisted =
      await this.roomRoundService.getRoomRoundByCodeRoom(roomId);
    const roomRoundData: RoomRoundInterface = {
      room_id: roomId,
      current_round: 1,
      word: 'animal',
      started_at: new Date(),
      painter: room.host_id,
      next_painter: 2,
    };
    let roomRound = null;
    if (roomRoundIsExisted) {
      roomRound = await this.roomRoundService.updateRoomRound(roomRoundData);
    } else
      roomRound = await this.roomRoundService.createRoundOfRoom(roomRoundData);
    this.server.in(codeRoom).emit(GAME_PLAY, roomRound);
  }
}
