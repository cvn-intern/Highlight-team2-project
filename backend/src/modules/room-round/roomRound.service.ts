import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomRound } from './roomRound.entity';
import { Injectable } from '@nestjs/common';
import { RoomRoundInterface } from './roomRound.interface';
import { RoomRoundInfoInterface } from '../room/room.interface';
import { Room } from '../room/room.entity';
import { WordService } from '../word/word.service';
import { RoomUserService } from '../room-user/roomUser.service';
const moment = require('moment');

@Injectable()
export class RoomRoundService {
  constructor(
    @InjectRepository(RoomRound)
    private roomRoundRepository: Repository<RoomRound>,
    private wordService: WordService,
    private roomUserService: RoomUserService,
  ) {}
  async getRoundOfRoom(roomId: number): Promise<RoomRound> {
    return await this.roomRoundRepository.findOne({
      where: {
        room_id: roomId,
      },
    });
  }
  async createRoundOfRoom(data: RoomRoundInterface): Promise<RoomRound> {
    return await this.roomRoundRepository.save({
      ...data,
    });
  }

  async updateRoomRound(roomRound: RoomRoundInterface): Promise<RoomRound> {
    await this.roomRoundRepository.update(
      { room_id: roomRound.room_id },
      { ...roomRound },
    );

    const roomUpdate: RoomRound = await this.roomRoundRepository.findOne({
      where: {
        room_id: roomRound.room_id,
      },
    });

    return roomUpdate;
  }

  async deleteRoomRound(roomId: number) {
    return await this.roomRoundRepository.delete({
      room_id: roomId,
    });
  }

  async initRoundInfomation(room: Room): Promise<RoomRoundInfoInterface> {
    const [{ word }, painterRound] = await Promise.all([
      this.wordService.getWordRandom(room.words_collection_id),
      this.roomUserService.assignPainterAndNextPainter(room),
    ]);
    const startedAt: Date = new Date();
    const endedAt = moment(startedAt).add(room.time_per_round, 'seconds');

    return {
      word,
      painterRound,
      endedAt,
      startedAt,
    };
  }
}
