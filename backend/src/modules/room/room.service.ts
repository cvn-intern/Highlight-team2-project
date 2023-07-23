import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { RoomInterface } from './room.interface';
import { randomString } from '../../common/utils/helper';
import { RoomRoundService } from '../room-round/roomRound.service';
import { RoomRepository } from './room.repository';
import { RoomUserService } from '../room-user/roomUser.service';

const MAX_LENGTH_RANDOM = 5;

@Injectable()
export class RoomService {
  constructor(
    private roomRepository: RoomRepository,
    private roomRoundService: RoomRoundService,
    private roomUserService: RoomUserService,
  ) { }


  async createNewRoom(roomInformation: RoomInterface): Promise<Room> {
    const codeRoom: string = randomString(MAX_LENGTH_RANDOM).toLocaleUpperCase();
    const idRoom: number = await this.roomRepository.generateIdRoom();

    const room: Room = this.roomRepository.create({
      ...roomInformation,
      code_room: `${codeRoom}_${idRoom}`,
      id: idRoom,
    });

    return await this.roomRepository.save(room);
  }

  async randomRoomForQuickPlay(): Promise<string> {
    let rooms = await this.roomRepository.getAvailableRooms();
    rooms = rooms.filter((room: RoomInterface) => room.users.length < room.max_player)

    if(rooms.length === 0) {
      throw new HttpException('Can not found available room!', HttpStatus.NOT_FOUND);
    } 

    return rooms[0].code_room;
  }

  async getRoomByCodeRoom(codeRoom: string): Promise<Room> {
    const room: Room = await this.roomRepository.getRoomByCodeRoom(codeRoom);

    if(!room) {
      throw new HttpException('Not found room!', HttpStatus.NOT_FOUND);
    }

    return room;
  }
}
