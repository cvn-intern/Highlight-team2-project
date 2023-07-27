import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomRound } from './roomRound.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomRoundService {
  constructor(
    @InjectRepository(RoomRound)
    private roomRoundRepository: Repository<RoomRound>,
  ) { }
  async getRoundOfRoom(roomId: number): Promise<RoomRound> {
    return await this.roomRoundRepository.findOne({
      where: {
        room_id: roomId,
      },
    });
  }
}
