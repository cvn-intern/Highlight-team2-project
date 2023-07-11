import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomRound } from './roomround.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomroundService {
    constructor(
        @InjectRepository(RoomRound)
        private roomRoundRepository: Repository<RoomRound>,
    ) {}
}
