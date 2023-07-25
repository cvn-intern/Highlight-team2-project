import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomUser } from '../room-user/roomUser.entity';

@Injectable()
export class RoomRepository extends Repository<Room> {
  constructor(
    @InjectRepository(Room)
    repository: Repository<Room>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async generateIdRoom(): Promise<number> {
    const rooms: Array<Room> = await this.find({
      order: {
        id: 'DESC',
      },
    });

    return rooms.length === 0 ? 1 : rooms[0].id + 1;
  }

  async getAvailableRooms(): Promise<any> {
    return await this.createQueryBuilder('room')
      .where('room.is_public = :is_public', { is_public: true })
      .leftJoinAndMapMany(
        'room.users',
        RoomUser,
        'roomuser',
        'roomuser.room_id = room.id',
      )
      .getMany();
  }

  async getRoomByCodeRoom(codeRoom: string): Promise<Room> {
    return await this.findOne({
      where: {
        code_room: codeRoom,
      },
    });
  }
}
