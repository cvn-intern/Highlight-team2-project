import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomUser } from './roomUser.entity';
import { Repository } from 'typeorm';
import { RoomUserRepository } from './roomUser.repository';
import { Room } from '../room/room.entity';

@Injectable()
export class RoomUserService {
  constructor(private roomUserRepository: RoomUserRepository) {}

  async createNewRoomUser(room_id: number, user_id: number): Promise<RoomUser> {
    const roomUser: RoomUser = await this.roomUserRepository.findOne({
      where: {
        room_id,
        user_id,
      },
    });

    if (roomUser) {
      await this.deleteRoomUser(room_id, user_id);
    }

    return await this.roomUserRepository.save({
      room_id,
      user_id,
    });
  }

  async deleteRoomUser(room_id: number, user_id: number) {
    const participant: RoomUser = await this.roomUserRepository.getParticipant(
      room_id,
      user_id,
    );

    if (!participant) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }

    return await this.roomUserRepository.delete({
      room_id,
      user_id,
    });
  }

  async getListUserOfRoom(room: Room): Promise<Array<Participant>> {
    const users = await this.roomUserRepository.getParticipantsOfRoom(room.id);
    const result: Array<Participant> = users.map((user: any, index: number) => {
      user = { ...user, ...user.user };
      delete user.user;

      return {
        ...user,
        is_host: user.id === room.host_id,
        is_painter: index === 0,
        is_next_painter: false,
      };
    });

    return result;
  }

  async checkUserInRoom(user_id: number, room_id: number): Promise<boolean> {
    const participant = await this.roomUserRepository.findOne({
      where: {
        room_id,
        user_id,
      },
    });

    return !!participant;
  }

  async getUserInRoomRandom(roomId: number): Promise<number> {
    const participant: RoomUser = await this.roomUserRepository.findOne({
      where: {
        room_id: roomId,
      },
    });

    return participant ? participant.user_id : null;
  }

  async assignPainterAndNextPainter(room: Room): Promise<PainterRound> {
    const participants: Array<Participant> = await this.getListUserOfRoom(room);

    const painterIndex: number = Math.floor(
      Math.random() * participants.length,
    );
    const painter: Participant = participants[painterIndex];
    const participantsExcept: Array<Participant> = participants.filter(
      (participant: Participant) => participant.id !== painter.id,
    );
    const nextPainterIndex: number = Math.floor(
      Math.random() * participantsExcept.length,
    );
    const nextPainter: Participant = participantsExcept[nextPainterIndex];

    return {
      painter: painter.id,
      next_painter: nextPainter.id,
    } as PainterRound;
  }

  async updateRoomUserScore(userId: number, score: number) {
    return this.roomUserRepository.update({ user_id: userId }, { score });
  }
}
