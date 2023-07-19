import { Repository } from "typeorm";
import { RoomUser } from "./roomUser.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class RoomUserRepository extends Repository<RoomUser> {
  constructor(
    @InjectRepository(RoomUser)
    repository: Repository<RoomUser>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async createRoomUser(id_room: number, id_user: number) {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    const roomUserRow = await this.createQueryBuilder('roomuser')
      .useTransaction(true)
      .setLock('pessimistic_write')
      .insert()
      .into(RoomUser)
      .values([
        {
          id_room,
          id_user,
        }
      ])
      .execute();
  }

  async getParticipantsOfRoom(id_room: number): Promise<RoomUser[]> {
    return await this.createQueryBuilder('roomuser')
      .where('id_room = :id_room', { id_room })
      .innerJoin('roomuser.id_user', 'user')
      .addSelect(['user.id', 'user.nickname', 'user.avatar'])
      .orderBy('roomuser.score', 'ASC')
      .getMany();
  }

  async getParticipant(id_room: number, id_user: number): Promise<RoomUser> {
    return await this.findOne({
      where: {
        id_room: id_room,
        id_user: id_user,
      },
    });
  }

  async countParticipantInRoom(id_room: number): Promise<Number> {
    return 0;
  }
}
