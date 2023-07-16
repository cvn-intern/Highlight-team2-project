import { Repository } from "typeorm";
import { Room } from "./room.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomUser } from "../room-user/roomUser.entity";

@Injectable()
export class RoomRepository extends Repository<Room> {
  constructor(
    @InjectRepository(Room)
    repository: Repository<Room>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async getAvailableRooms(): Promise<any> {
    return await this.createQueryBuilder('room')
    .where('room.is_public = :is_public', {is_public: true})
    .leftJoinAndMapMany('room.users', RoomUser, 'roomuser', 'roomuser.id_room = room.id')
    .getMany();
  }
}