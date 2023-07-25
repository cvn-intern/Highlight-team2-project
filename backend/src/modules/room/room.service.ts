import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Room } from './room.entity';
import { RoomInterface } from './room.interface';
import { randomString } from '../../common/utils/helper';
import { RoomRoundService } from '../room-round/roomRound.service';
import { RoomRepository } from './room.repository';
import { RoomUserService } from '../room-user/roomUser.service';
import { RoomUser } from '../room-user/roomUser.entity';

const MAX_LENGTH_RANDOM = 5;

@Injectable()
export class RoomService {
  constructor(
    private roomRepository: RoomRepository,
    private roomRoundService: RoomRoundService,
    private roomUserService: RoomUserService,
  ) {}

  async createNewRoom(roomInformation: RoomInterface): Promise<Room> {
    const codeRoom: string =
      randomString(MAX_LENGTH_RANDOM).toLocaleUpperCase();
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
    rooms = rooms.filter(
      (room: RoomInterface) => room.users.length < room.max_player,
    );

    if (rooms.length === 0) {
      throw new HttpException(
        'Can not found available room!',
        HttpStatus.NOT_FOUND,
      );
    }

    return rooms[0].code_room;
  }

  async getRoomByCodeRoom(codeRoom: string) {
    const isExisted = await this.roomRepository.getRoomByCodeRoom(codeRoom);
    
    if(!isExisted) {
      throw new HttpException('Not found room!', HttpStatus.NOT_FOUND);
    } 

    const room = await this.roomRepository.getInformationRoom(codeRoom);

    return room;
  }

  async checkUserInRoom(idUser: number, idRoom: number): Promise<boolean> {
    return await this.roomUserService.checkUserInRoom(idUser, idRoom);
  }

  async joinRoom(idRoom: number, idUser: number): Promise<RoomUser> {
    const participant = await this.roomUserService.createNewRoomUser(idRoom, idUser);

    return participant;
  }

  async checkRoomAvailability(codeRoom: string): Promise<boolean> {
    const room = await this.roomRepository.getInformationRoom(codeRoom);


    return room.max_player > room.participants;
  }
}
