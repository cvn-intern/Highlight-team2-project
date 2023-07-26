import { Repository } from 'typeorm';
import { RoomUser } from './roomUser.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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
      .innerJoin('roomuser.user_id', 'user')
      .addSelect(['user.id', 'user.nickname', 'user.avatar'])
      .orderBy('roomuser.score', 'ASC')
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
