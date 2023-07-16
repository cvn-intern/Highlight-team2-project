import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomUser } from "./roomUser.entity";
import { Repository } from "typeorm";
import { RoomUserRepository } from "./roomUser.repository";

@Injectable()
export class RoomUserService {
  constructor(
    private roomUserRepository: RoomUserRepository,
  ) { }

  async createNewRoomUser(id_room: number, id_user: number): Promise<RoomUser> {
    const roomUser: RoomUser = await this.roomUserRepository.findOne({
      where: {
        id_room: id_room,
      id_user: id_user,
      }
    });

    if(roomUser) {
      throw new HttpException('Duplicated!', HttpStatus.CONFLICT);
    }

    return await this.roomUserRepository.save({
      id_room: id_room,
      id_user: id_user,
    });
  }

  async deleteRoomUser(id_room: number, id_user: number) {
    const participant: RoomUser = await this.roomUserRepository.getParticipant(id_room, id_user);

    if (!participant) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }

    return await this.roomUserRepository.delete({
      id_room: id_room,
      id_user: id_user,
    });
  }

  async getListUserOfRoom(id_room: number) {
    return await this.roomUserRepository.getParticipantsOfRoom(id_room);
  }
}