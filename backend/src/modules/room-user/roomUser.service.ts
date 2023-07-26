import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomUser } from './roomUser.entity';
import { Repository } from 'typeorm';
import { RoomUserRepository } from './roomUser.repository';

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

    if(roomUser) {
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

  async getListUserOfRoom(room_id: number) {
    return await this.roomUserRepository.getParticipantsOfRoom(room_id);
  }

  async checkUserInRoom(user_id: number, room_id: number): Promise<boolean> {
    const participant = await this.roomUserRepository.findOne({
     where: {
      room_id,
      user_id,
     }
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
}
