import { ConnectedSocket, MessageBody, SubscribeMessage, WsException } from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import { BLOCK_MESSAGE, HOST_KICK_USER_CONTENT, KICK_CHANNEL, NOTIFY_CHANNEL } from '../constant';
import { SocketClient } from '../socket.class';
import { errorsSocket } from 'src/common/errors/errorCode';
import { Room } from 'src/modules/room/room.entity';
import { Socket } from 'socket.io';
import { Chat } from '../types/chat';

type KickUser = {
  codeRoom: string;
  userId: number;
  nickname: string;
};

export class RoomGateway extends SocketGateway {
  @SubscribeMessage(KICK_CHANNEL)
  async hanldeKick(@MessageBody() data: KickUser, @ConnectedSocket() client: SocketClient) {
    const room: Room = await this.roomService.getRoomByCodeRoom(data.codeRoom);

    if (!room) {
      throw new WsException(errorsSocket.ROOM_NOT_FOUND);
    }

    if (room.host_id !== client.user.id) {
      throw new WsException(errorsSocket.YOU_NOT_HOST);
    }
    const socketIdKickedUser = await this.redisService.getObjectByKey(`USER:${data.userId}:SOCKET`);
    const socketKickedUser: Socket = this.server.sockets.sockets.get(socketIdKickedUser);

    socketKickedUser.leave(room.code_room);
    const messageContent: Chat = {
      user: data.nickname,
      type: BLOCK_MESSAGE,
      message: HOST_KICK_USER_CONTENT,
    };
    socketKickedUser.to(room.code_room).emit(`${room.code_room}-leave`, messageContent);
    this.server.to(socketIdKickedUser).emit(NOTIFY_CHANNEL, `You ${HOST_KICK_USER_CONTENT}`);

    await this.roomUserService.deleteRoomUser(room.id, data.userId);
    await this.redisService.deleteObjectByKey(`USER:${data.userId}:ROOM`);
    await this.socketService.checkAndEmitToHostRoom(this.server, room);

    const roomRound = await this.roomRoundService.getRoundOfRoom(room.id);
    if (!roomRound) return;

    const participants = await this.roomUserService.getListUserOfRoom(room);
    if (participants.length === 1) {
      await this.roomRoundService.deleteRoomRound(room.id);
      return;
    }

    await this.socketService.handlePainterOrNextPainterOutRoom(roomRound, data.userId, this.server, room);
    await this.socketService.sendListParticipantsInRoom(this.server, room);
  }
}
