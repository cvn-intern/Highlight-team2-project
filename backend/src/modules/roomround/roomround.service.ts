import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomRound } from './roomRound.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomRoundService {
    constructor(
        @InjectRepository(RoomRound)
        private roomRoundRepository: Repository<RoomRound>,
    ) {}

    async countTheNumberOfUserInRoom(idRoom: number) {
        return this.roomRoundRepository.count({
            where: {
                id_room: idRoom,
            },
        });
    }
}
