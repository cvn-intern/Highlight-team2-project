import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Room } from './room.entity';
import {
  RoomInterface,
  RoomRoundInfoInterface,
  RoomStatusResponseInterface,
} from './room.interface';
import { randomString } from '../../common/utils/helper';
import { RoomRoundService } from '../room-round/roomRound.service';
import { RoomRepository } from './room.repository';
import { RoomUserService } from '../room-user/roomUser.service';
import { RoomUser } from '../room-user/roomUser.entity';
import { RoomRound } from '../room-round/roomRound.entity';
import { WordService } from '../word/word.service';
import { now } from 'moment';
const moment = require('moment');

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

  async getRoomByCodeRoom(codeRoom: string): Promise<Room> {
    const isExisted: Room = await this.roomRepository.getRoomByCodeRoom(
      codeRoom,
    );

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
    const participant = await this.roomUserService.createNewRoomUser(
      idRoom,
      idUser,
    );

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

  async checkHostInRoom(roomId: number, hostId: number): Promise<boolean> {
    const isInRoom = await this.roomUserService.checkUserInRoom(hostId, roomId);

    return !!isInRoom;
  }

  async updateRoom(room: RoomInterface): Promise<Room> {
    await this.roomRepository.update({ id: room.id }, { ...room });

    const roomUpdate: Room = await this.roomRepository.findOne({
      where: {
        id: room.id,
      },
    });

    return roomUpdate;
  }

  async changeHost(codeRoom: string): Promise<Room> {
    const room: Room = await this.roomRepository.getRoomByCodeRoom(codeRoom);

    if (!room) {
      throw new HttpException('Not found room!', HttpStatus.NOT_FOUND);
    }

    const isHostInRoom = await this.checkHostInRoom(room.id, room.host_id);

    if (isHostInRoom) {
      return room;
    }

    const userId: number = await this.roomUserService.getUserInRoomRandom(
      room.id,
    );

    if (!userId) {
      await this.roomRoundService.deleteRoomRound(room.id);
      throw new HttpException('Nobody in room!', HttpStatus.BAD_REQUEST);
    }

    const updateRoom = await this.updateRoom({ ...room, host_id: userId });

    return updateRoom;
  }

  async checkStartGame(roomId: number): Promise<boolean> {
    const isStart = await this.roomRoundService.getRoundOfRoom(roomId);

    return !!isStart;
  }

  async getPartipantsInRoom(room: Room): Promise<Array<Participant>> {
    return await this.roomUserService.getListUserOfRoom(room);
  }

  async initRoomRound(room: Room): Promise<RoomRound> {
    const { word, painterRound, endedAt, startedAt } =
      await this.roomRoundService.initRoundInfomation(room);

    const roomRound: RoomRound = await this.roomRoundService.createRoundOfRoom({
      room_id: room.id,
      current_round: 1,
      word,
      started_at: startedAt,
      ended_at: moment(endedAt).toDate(),
      ...painterRound,
    });
    return roomRound;
  }

  getRoomStatus(room: Room): RoomStatusResponseInterface {
    if (!room)
      return {
        success: false,
      };
  
    return {
      success: true,
      status: room.status,
    };
  }

  async updateRoomStatus(room: Room, status: string) {
    await this.roomRepository.save({ ...room, status, updated_at: new Date() });
  }
}
