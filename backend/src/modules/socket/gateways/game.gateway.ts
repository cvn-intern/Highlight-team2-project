import { MessageBody, SubscribeMessage, WsException } from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import {
  END_GAME,
  GAME_INTERVAL_SHOW_WORD_CHANNEL,
  GAME_NEW_TURN,
  GAME_NEW_TURN_CHANNEL,
  GAME_PRESENT_PROGRESS_CHANNEL,
  GAME_PRESENT_PROGRESS_NEW_PLAYER_CHANNEL,
  GAME_START_CHANNEL,
  GAME_UPDATE_RANKING_CHANNEL,
  GAME_WAIT_PLAYERS_CHANNEL,
} from '../constant';
import { errorsSocket } from 'src/common/errors/errorCode';

export class GameGateway extends SocketGateway {
  @SubscribeMessage(GAME_NEW_TURN_CHANNEL)
  async handleNewTurn(@MessageBody() codeRoom: string) {
    const room = await this.roomService.getRoomByCodeRoom(codeRoom);

    if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);

    let roundOfRoom = await this.roomRoundService.getRoundOfRoom(room.id);
    if (roundOfRoom) {
      if (roundOfRoom.current_round + 1 > room.number_of_round) {
        return this.server.to(room.code_room).emit(END_GAME, true);
      }

      const { endedAt, painterRound, startedAt, word } = await this.roomRoundService.initRoundInfomation(room);
      roundOfRoom = await this.roomRoundService.updateRoomRound({
        ...roundOfRoom,
        word,
        ended_at: endedAt,
        started_at: startedAt,
        painter: painterRound.painter,
        next_painter: painterRound.next_painter,
        current_round: roundOfRoom.current_round + 1,
      });
    } else {
      roundOfRoom = await this.roomService.initRoomRound(room);
    }

    await this.roomRoundService.cacheDataRoomRound(roundOfRoom);

    await this.roomService.updateRoomStatus(room, GAME_NEW_TURN);
    this.server.in(codeRoom).emit(GAME_NEW_TURN_CHANNEL, roundOfRoom);
    await this.socketService.sendListParticipantsInRoom(this.server, room);
  }
  @SubscribeMessage(GAME_START_CHANNEL)
  async handleStartGame(@MessageBody() codeRoom: string) {
    const room = await this.roomService.getRoomByCodeRoom(codeRoom);

    if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);
    await this.roomService.updateRoomStatus(room, GAME_START_CHANNEL);

    this.server.in(codeRoom).emit(GAME_START_CHANNEL);
  }

  @SubscribeMessage(GAME_PRESENT_PROGRESS_CHANNEL)
  async handleSendPresentProgress(@MessageBody() data: GamePresentProgress) {
    const { codeRoom, ...rest } = data;
    this.server.in(codeRoom).emit(GAME_PRESENT_PROGRESS_CHANNEL, rest);
  }

  @SubscribeMessage(GAME_PRESENT_PROGRESS_NEW_PLAYER_CHANNEL)
  async handleGameProgress(@MessageBody() data: GamePresentProgress & { socketId: string }) {
    const { socketId, codeRoom: _, ...rest } = data;
    this.server.to(socketId).emit(GAME_PRESENT_PROGRESS_NEW_PLAYER_CHANNEL, rest);
  }

  @SubscribeMessage(GAME_UPDATE_RANKING_CHANNEL)
  async handleUpdateRankingBoard(@MessageBody() data: GameRankingUpdate) {
    const { codeRoom, ...rest } = data;
    this.server.in(codeRoom).emit(GAME_UPDATE_RANKING_CHANNEL, rest);
    await Promise.all(
      rest.newParticipants.map((participant) =>
        this.roomUserService.updateRoomUserScore(participant.id, participant.score),
      ),
    );
  }

  @SubscribeMessage(GAME_INTERVAL_SHOW_WORD_CHANNEL)
  async handleGameIntervalShowWord(@MessageBody() codeRoom: string) {
    const room = await this.roomService.getRoomByCodeRoom(codeRoom);

    if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);
    this.server.in(codeRoom).emit(GAME_INTERVAL_SHOW_WORD_CHANNEL);

    await this.roomService.updateRoomStatus(room, GAME_INTERVAL_SHOW_WORD_CHANNEL);
  }

  @SubscribeMessage(GAME_WAIT_PLAYERS_CHANNEL)
  async handleGameWaitPlayers(@MessageBody() codeRoom: string) {
    const room = await this.roomService.getRoomByCodeRoom(codeRoom);

    if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);

    await Promise.all([
      this.roomUserService.resetRoomUsersScore(room),
      this.roomService.updateRoomStatus(room, GAME_WAIT_PLAYERS_CHANNEL),
      this.roomRoundService.deleteRoomRound(room.id),
    ]);
  }
}
