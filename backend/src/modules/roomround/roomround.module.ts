import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomRound } from './roomround.entity';
import { RoomroundController } from './roomround.controller';
import { RoomroundService } from './roomround.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([RoomRound])
    ],
    controllers: [RoomroundController],
    providers: [RoomroundService],
    exports: [RoomroundService],
})
export class RoomroundModule {}
