import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomUser } from './roomuser.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomuserService {
    constructor(
        @InjectRepository(RoomUser)
        private roomUserRepository: Repository<RoomUser>,
    ) {}
}
