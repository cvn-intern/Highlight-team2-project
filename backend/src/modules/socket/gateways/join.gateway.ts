import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { SocketGateway } from "./socket.gateway";
import { Room } from "src/modules/room/room.entity";
import { extractIdRoom } from "src/common/utils/helper";
import { LEAVE_ROOM_CONTENT, LEAVE_ROOM_TYPE } from "../constant";
import { Socket } from "socket.io";
import { expireTimeOneDay } from "src/common/variables/constVariable";
import { errorsSocket } from "src/common/errors/errorCode";

export class JoinGateway extends SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  async handleDisconnect(@ConnectedSocket() client: any) {
    try {
      const isBlock = await this.socketService.checkInBlockList(client);
      if (isBlock) {
        return;
      }

      const payload = await this.socketService.extractPayload(client);
      if (!payload) {
        this.logger.warn(`${client.id} invalid credential!`);
        return;
      }

      const user = await this.userService.getUserById(payload.id);
      if (!user) {
        this.socketService.sendError(client, errorsSocket.USER_NOT_FOUND);
        return;
      }

      const codeRoom: string = await this.redisService.getObjectByKey(
        `USER:${user.id}:ROOM`,
      );

      if (!codeRoom) {
        await this.socketService.removeClientDisconnection(client);
        return;
      }

      let room: Room = await this.roomService.getRoomByCodeRoom(codeRoom);
      if (!room) {
        this.socketService.sendError(client, errorsSocket.ROOM_NOT_FOUND);
        return;
      }

      client.leave(room.code_room);

      const ROOM_LEAVE = `${room.code_room}-leave`
      this.server.in(codeRoom).emit(ROOM_LEAVE, {
        user: user.nickname,
        type: LEAVE_ROOM_TYPE,
        message: LEAVE_ROOM_CONTENT,
      });

      await this.roomUserService.deleteRoomUser(room.id, user.id);

      if (client.user.id === room.host_id) {
        room = await this.roomService.changeHost(room.code_room);
      }

      await this.socketService.sendListParticipantsInRoom(this.server, room);
      await this.socketService.removeClientDisconnection(client);
      let roomRound = await this.roomRoundService.getRoundOfRoom(room.id);
      if (!roomRound) return;

      const participants = await this.roomUserService.getListUserOfRoom(room);
      if (participants.length === 1) {
        await this.roomRoundService.deleteRoomRound(room.id);
        return;
      }

      if (roomRound.painter === client.user.id) {
        const { endedAt, painterRound, startedAt, word } =
          await this.roomRoundService.initRoundInfomation(room);
        roomRound = await this.roomRoundService.updateRoomRound({
          ...roomRound,
          word,
          ended_at: endedAt,
          started_at: startedAt,
          painter: roomRound.next_painter,
          next_painter:
            [painterRound.next_painter, painterRound.painter].find(
              (painter) => painter !== roomRound.next_painter,
            ) ?? roomRound.painter,
        });
        await this.socketService.updateRoomRoundWhenDrawerOut(
          this.server,
          codeRoom,
          roomRound,
        );
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const isMultipleTab = await this.socketService.checkLoginMultipleTab(client);

      if (isMultipleTab) {
        await this.redisService.setObjectByKeyValue(`BLOCKLIST:SOCKET:${client.id}`, client.id, expireTimeOneDay * 365);
        this.socketService.sendError(client, errorsSocket.MULTIPLE_TAB);
        return;
      }

      this.socketService.storeClientConnection(client);
    } catch (error) {
      this.logger.error(error);
    }
  }
}