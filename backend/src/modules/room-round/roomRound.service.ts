import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomRound } from './roomRound.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomRoundService {
  constructor(
    @InjectRepository(RoomRound)
    private roomRoundRepository: Repository<RoomRound>,
  ) {}

  async countTheNumberOfUserInRoom(idRoom: number) {
    return this.roomRoundRepository.count({
      where: {
        room_id: idRoom,
      },
    });
  }
}
