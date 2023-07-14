import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomUser } from './roomUser.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomUserService {
  constructor(
    @InjectRepository(RoomUser)
    private roomUserRepository: Repository<RoomUser>,
  ) { }

  async createNewRoomUser(id_room: number, id_user: number): Promise<RoomUser> {
    return await this.roomUserRepository.save({
      id_room: id_room,
      id_user: id_user,
    });
  }

  async deleteRoomUser(id_room: number, id_user: number) {
    return await this.roomUserRepository.delete({
      id_room: id_room,
      id_user: id_user,
    });
  }

  async getListUserOfRoom(id_room: number) {
    return await this.roomUserRepository.createQueryBuilder('roomuser')
      .where('id_room = :id_room', { id_room })
      .innerJoin('roomuser.id_user', 'user')
      .addSelect(['user.id', 'user.nickname', 'user.avatar'])
      .orderBy('roomuser.score', 'ASC')
      .getMany();
  }
}
