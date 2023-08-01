import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WsException,
} from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import { SocketClient } from '../socket.class';
import {
  GAME_INTERVAL_SHOW_WORD_CHANNEL,
  GAME_NEW_TURN,
  GAME_NEW_TURN_CHANNEL,
  GAME_PROGRESS_CHANNEL,
  GAME_REFRESH_CHANNEL,
  GAME_START_CHANNEL,
  GAME_UPDATE_RANKING_CHANNEL,
  GAME_WAIT_PLAYERS_CHANNEL,
  MAX_PROGRESS_PERCENTAGE,
  MIN_PROGRESS_PERCENTAGE,
  TIME_PERSTEP,
} from '../constant';
import { errorsSocket } from 'src/common/errors/errorCode';

export class GameGateway extends SocketGateway {
  @SubscribeMessage(GAME_NEW_TURN_CHANNEL)
  async handleNewTurn(
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
        painter: roundOfRoom.next_painter,
        next_painter:
          [painterRound.next_painter, painterRound.painter].find(
            (painter) => painter !== roundOfRoom.next_painter,
          ) ?? roundOfRoom.painter,
        current_round: roundOfRoom.current_round + 1,
      });
    } else {
      roundOfRoom = await this.roomService.initRoomRound(room);
    }
    await this.roomService.updateRoomStatus(room, GAME_NEW_TURN);
    this.server.in(codeRoom).emit(GAME_NEW_TURN_CHANNEL, roundOfRoom);
  }
  @SubscribeMessage(GAME_START_CHANNEL)
  async handleStartGame(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: SocketClient,
  ) {
    const room = await this.roomService.getRoomByCodeRoom(codeRoom);

    if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);
    await this.roomService.updateRoomStatus(room, GAME_START_CHANNEL);
    this.server.in(codeRoom).emit(GAME_START_CHANNEL);
  }

  @SubscribeMessage(GAME_PROGRESS_CHANNEL)
  async handleGameProgress(
    @MessageBody() data: GameProgressUpdate,
    @ConnectedSocket() client: SocketClient,
  ) {
    const number_percentage_to_decrease_per_step =
      (MAX_PROGRESS_PERCENTAGE * TIME_PERSTEP) / data.maximumTimeInMiliSeconds;

    this.socketService.setProgressInterval(
      MIN_PROGRESS_PERCENTAGE,
      number_percentage_to_decrease_per_step,
      TIME_PERSTEP,
      (progress: number) => {
        this.server.in(data.codeRoom).emit(GAME_PROGRESS_CHANNEL, progress);
      },
    );
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

  @SubscribeMessage(GAME_INTERVAL_SHOW_WORD_CHANNEL)
  async handleGameIntervalShowWord(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: SocketClient,
  ) {
    const room = await this.roomService.getRoomByCodeRoom(codeRoom);

    if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);
    this.server.in(codeRoom).emit(GAME_INTERVAL_SHOW_WORD_CHANNEL);

    await this.roomService.updateRoomStatus(
      room,
      GAME_INTERVAL_SHOW_WORD_CHANNEL,
    );
  }

  @SubscribeMessage(GAME_WAIT_PLAYERS_CHANNEL)
  async handleGameWaitPlayers(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: SocketClient,
  ) {
    const room = await this.roomService.getRoomByCodeRoom(codeRoom);

    if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);

    await Promise.all([
      this.roomUserService.resetRoomUsersScore(room),
      this.roomService.updateRoomStatus(room, GAME_WAIT_PLAYERS_CHANNEL),
      this.roomRoundService.deleteRoomRound(room.id),
    ]);
  }

  @SubscribeMessage(GAME_REFRESH_CHANNEL)
  async handleRefresh(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: SocketClient,
  ) {
    this.socketService.clearProgressInterval()
  }
}
