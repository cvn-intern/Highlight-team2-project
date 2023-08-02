import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomUser } from '../room-user/roomUser.entity';
import { Language } from '../language/language.entity';
import { WordsCollection } from '../words-collection/wordsCollection.entity';
import { Theme } from '../theme/theme.entity';
import { RoomRound } from '../room-round/roomRound.entity';

@Injectable()
export class RoomRepository extends Repository<Room> {
  constructor(
    @InjectRepository(Room)
    repository: Repository<Room>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async generateIdRoom(): Promise<number> {
    const rooms: Array<Room> = await this.find({
      order: {
        id: 'DESC',
      },
    });

    return rooms.length === 0 ? 1 : rooms[0].id + 1;
  }

  async getAvailableRooms(): Promise<any> {
    return await this.createQueryBuilder('room')
      .where('room.is_public = :is_public', { is_public: true })
      .leftJoinAndMapMany('room.users', RoomUser, 'roomuser', 'roomuser.room_id = room.id')
      .getMany();
  }

  async getRoomsByQuery(theme: string, language_code: string) {
    const queryBuilder = this.createQueryBuilder('room')
      .leftJoinAndMapOne('room.language', Language, 'language', 'language.code = room.language_code')
      .leftJoinAndMapOne(
        'room.words_collection',
        WordsCollection,
        'wordcollection',
        'room.words_collection_id = wordcollection.id',
      )
      .leftJoinAndMapOne('wordcollection.theme', Theme, 'theme', 'wordcollection.theme_id = theme.id')
      .leftJoinAndMapMany('room.participants', RoomUser, 'roomuser', 'roomuser.room_id = room.id')
      .leftJoinAndMapOne('room.room_round', RoomRound, 'roomround', 'roomround.room_id = room.id')
      .select(['room', 'roomuser', 'wordcollection', 'theme'])
      .addSelect(['theme.thumbnail', 'theme.name', 'language.code', 'roomround.current_round']);

    if (theme != 'all') {
      queryBuilder.andWhere('theme.name = :theme', { theme });
    }

    const rooms = await queryBuilder
      .andWhere('room.language_code = :language_code', { language_code })
      .andWhere('room.is_public = true')
      .getMany();

    return rooms;
  }

  async getRoomByCodeRoom(codeRoom: string): Promise<Room> {
    return await this.createQueryBuilder('room').where('code_room = :codeRoom', { codeRoom }).getOne();
  }

  async getInformationRoom(codeRoom: string) {
    const room: any = await this.createQueryBuilder('room')
      .where('room.code_room = :codeRoom', { codeRoom })
      .leftJoinAndMapOne('room.language', Language, 'language', 'language.code = room.language_code')
      .leftJoinAndMapOne(
        'room.words_collection',
        WordsCollection,
        'wordcollection',
        'room.words_collection_id = wordcollection.id',
      )
      .leftJoinAndMapOne('wordcollection.theme', Theme, 'theme', 'wordcollection.theme_id = theme.id')
      .leftJoinAndMapMany('room.participants', RoomUser, 'roomuser', 'roomuser.room_id = room.id')
      .select(['room', 'room.host_id'])
      .addSelect(['theme.name', 'wordcollection.id', 'language.name', 'roomuser'])
      .getOne();

    room.participants = room.participants.length;

    return room;
  }
}
