import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { RoomInterface } from './room.interface';
import { randomString } from 'src/common/utils/helper';
import { RoomRoundService } from '../roomround/roomRound.service';

const MAX_LENGTH_RANDOM = 5;

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private roomRoundService: RoomRoundService,
  ) { }

  async createNewRoom(roomInformation: RoomInterface) {
    const codeRoom: string = randomString(MAX_LENGTH_RANDOM).toLocaleUpperCase();

    const room = await this.roomRepository.save({
      ...roomInformation,
      code_room: codeRoom,
    });

    return await this.roomRepository.save({
      ...room,
      code_room: `${room.code_room}_${room.id}`,
    });
  }

  async randomRoomForQuickPlay() {
    const listRoomAvailable = await this.roomRepository.manager.query(
      `
        select r.code_room
        from public.room as r left join public.roomuser as ru on r.id = ru.id_room
        where is_public = true
        group by r.code_room, r.max_player
        having count(ru.id_user) < r.max_player
      `
    );

    return listRoomAvailable.length !== 0 ? listRoomAvailable[0] : null;
  }
}
