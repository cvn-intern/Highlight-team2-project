import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomRound } from './roomRound.entity';
import { RoomRoundController } from './roomRound.controller';
import { RoomRoundService } from './roomRound.service';
import { Module } from '@nestjs/common';
import { RoomUserModule } from '../room-user/roomUser.module';
import { WordModule } from '../word/word.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoomRound]), RoomUserModule, WordModule],
  controllers: [RoomRoundController],
  providers: [RoomRoundService],
  exports: [RoomRoundService],
})
export class RoomRoundModule {}
