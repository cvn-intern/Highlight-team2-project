import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WsException,
} from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import { SocketClient } from '../socket.class';
import {
  GAME_PLAY,
  GAME_PROGRESS_CHANNEL,
  GAME_START_CHANNEL,
  GAME_UPDATE_RANKING_CHANNEL,
} from '../constant';
import { errorsSocket } from 'src/common/errors/errorCode';

export class GameGateway extends SocketGateway {
  // @SubscribeMessage(GAME_START_CHANNEL)
  // async handleStartGame(
  //   @MessageBody() codeRoom: string,
  //   @ConnectedSocket() client: SocketClient,
  // ) {
  //   const room = await this.roomService.getRoomByCodeRoom(codeRoom);

  //   if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);

  //   let roundOfRoom = await this.roomRoundService.getRoundOfRoom(room.id);
  //   if (roundOfRoom) {
  //     const { endedAt, painterRound, startedAt, word } =
  //       await this.roomRoundService.initRoundInfomation(room);
  //     roundOfRoom = await this.roomRoundService.updateRoomRound({
  //       ...roundOfRoom,
  //       word,
  //       ended_at: endedAt,
  //       started_at: startedAt,
  //       ...painterRound,
  //     });
  //   } else {
  //     roundOfRoom = await this.roomService.initRoomRound(room);
  //   }

  //   await this.roomService.updateRoomStatus(room, 'game-start');
  //   this.server.in(codeRoom).emit(GAME_PLAY, roundOfRoom);
  // }
  @SubscribeMessage(GAME_START_CHANNEL)
  async handleStartGame(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: SocketClient,
  ) {
    const room = await this.roomService.getRoomByCodeRoom(codeRoom);

    if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);

    let roundOfRoom = await this.roomRoundService.getRoundOfRoom(room.id);
    if (roundOfRoom) {
      const { endedAt, painterRound, startedAt, word } =
        await this.roomRoundService.initRoundInfomation(room);
      roundOfRoom = await this.roomRoundService.updateRoomRound({
        ...roundOfRoom,
        word,
        ended_at: endedAt,
        started_at: startedAt,
        ...painterRound,
      });
    } else {
      roundOfRoom = await this.roomService.initRoomRound(room);
    }

    await this.roomService.updateRoomStatus(room, 'game-start');
    this.server.in(codeRoom).emit(GAME_PLAY, roundOfRoom);
  }

  @SubscribeMessage(GAME_PROGRESS_CHANNEL)
  async handleGameProgress(
    @MessageBody() data: GameProgressUpdate,
    @ConnectedSocket() client: SocketClient,
  ) {
    this.server.in(data.codeRoom).emit(GAME_PROGRESS_CHANNEL, data.progress);
  }

  @SubscribeMessage(GAME_UPDATE_RANKING_CHANNEL)
  async handleUpdateRankingBoard(
    @MessageBody() data: GameRankingUpdate,
    @ConnectedSocket() client: SocketClient,
  ) {
    const { codeRoom, ...rest } = data;
    this.server.in(codeRoom).emit(GAME_UPDATE_RANKING_CHANNEL, rest);
    await Promise.all(
      rest.newParticipants.map((participant) =>
        this.roomUserService.updateRoomUserScore(
          participant.id,
          participant.score,
        ),
      ),
    );
  }
}
