import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomRound } from './roomRound.entity';
import { RoomRoundService } from './roomRound.service';
import { RoomRoundController } from './roomRound.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([RoomRound])
    ],
    controllers: [RoomRoundController],
    providers: [RoomRoundService],
    exports: [RoomRoundService],
})
export class RoomRoundModule {}
