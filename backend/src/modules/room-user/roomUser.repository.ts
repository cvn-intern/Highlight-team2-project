import { Repository } from 'typeorm';
import { RoomUser } from './roomUser.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class RoomUserRepository extends Repository<RoomUser> {
  constructor(
    @InjectRepository(RoomUser)
    repository: Repository<RoomUser>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async getParticipantsOfRoom(room_id: number): Promise<RoomUser[]> {
    return await this.createQueryBuilder('roomuser')
      .where('room_id = :room_id', { room_id })
      .leftJoinAndMapOne('roomuser.user', User, 'user', 'user.id = roomuser.user_id')
      .select(['roomuser.score', 'roomuser.answered_at'])
      .addSelect(['user.id', 'user.avatar', 'user.nickname'])
      .orderBy('roomuser.score', 'DESC')
      .getMany();
  }

  async getParticipant(room_id: number, user_id: number): Promise<RoomUser> {
    return await this.findOne({
      where: {
        room_id,
        user_id,
      },
    });
  }
}
