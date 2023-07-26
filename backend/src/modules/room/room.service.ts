import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Room } from './room.entity';
import { RoomInterface } from './room.interface';
import { extractIdRoom, randomString } from '../../common/utils/helper';
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
  ) { }

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
    const isExisted: Room = await this.roomRepository.getRoomByCodeRoom(codeRoom);

    if (!isExisted) {
      throw new HttpException('Not found room!', HttpStatus.NOT_FOUND);
    }

    const room = await this.roomRepository.getInformationRoom(codeRoom);

    return {
      ...room,
      host_id: isExisted.host_id,
    };
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

  async qualifiedToStart(codeRoom: string): Promise<boolean> {
    const room = await this.roomRepository.getInformationRoom(codeRoom);

    return room.participants >= 2;
  }

  async checkHostInRoom(roomId: number, hostId: number): Promise<Boolean> {
    const isInRoom = await this.roomUserService.checkUserInRoom(hostId, roomId);

    return !!isInRoom;
  }

  async updateRoom(room: RoomInterface): Promise<Room> {
    await this.roomRepository.update({ id: room.id }, { ...room });

    const roomUpdate: Room = await this.roomRepository.findOne({
      where: {
        id: room.id,
      },
      select: {
        host_id: true,
      },
    });
    return roomUpdate;
  }

  async changeHost(codeRoom: string): Promise<Room> {
    const room: Room = await this.roomRepository.getRoomByCodeRoom(codeRoom);

    if (!room) {
      throw new HttpException('Not found room!', HttpStatus.NOT_FOUND);
    }

    const isHostInRoom = await this.checkHostInRoom(room.host_id, room.id);

    if (isHostInRoom) {
      return;
    }

    const userId: number = await this.roomUserService.getUserInRoomRandom(room.id);

    if (!userId) {
      throw new HttpException('Nobody in room!', HttpStatus.BAD_REQUEST);
    }

    const updateRoom = await this.updateRoom({ ...room, host_id: userId });
    
    return updateRoom;
  }

  async checkStartGame(roomId: number): Promise<boolean> {
    const isStart = await this.roomRoundService.getRoundOfRoom(roomId);

    return !!isStart;
  }
}
