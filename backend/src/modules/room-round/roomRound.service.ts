import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomRound } from './roomRound.entity';
import { Injectable } from '@nestjs/common';
import { RoomRoundInterface } from './roomRound.interface';

@Injectable()
export class RoomRoundService {
  constructor(
    @InjectRepository(RoomRound)
    private roomRoundRepository: Repository<RoomRound>,
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
  async getRoomRoundByCodeRoom(roomId: number): Promise<boolean> {
    const roomRound = await this.roomRoundRepository.findOne({
      where: {
        room_id: roomId,
      },
    });
    return !!roomRound;
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
}
