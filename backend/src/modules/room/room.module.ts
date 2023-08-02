import { Logger, Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { RoomUserModule } from '../room-user/roomUser.module';
import { RoomRoundModule } from '../room-round/roomRound.module';
import { RoomUser } from '../room-user/roomUser.entity';
import { RoomUserService } from '../room-user/roomUser.service';
import { RoomRepository } from './room.repository';
import { WordModule } from '../word/word.module';
import { RedisModule } from '../redis/redis.module';
import { WordsCollectionService } from '../words-collection/wordsCollection.service';
import { WordsCollectionModule } from '../words-collection/wordsCollection.module';
import { WordsCollectionRepository } from '../words-collection/wordsCollection.repository';
import { WordsCollection } from '../words-collection/wordsCollection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomUser, WordsCollection]),
    JwtModule,
    UserModule,
    RoomRoundModule,
    RoomUserModule,
    WordModule,
    WordsCollectionModule,
    RedisModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, Logger, RoomUserService, WordsCollectionService, RoomRepository, WordsCollectionRepository],
  exports: [RoomService],
})
export class RoomModule {}
