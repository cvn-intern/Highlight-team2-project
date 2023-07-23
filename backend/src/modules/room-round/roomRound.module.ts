import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomRound } from "./roomRound.entity";
import { RoomRoundController } from "./roomRound.controller";
import { RoomRoundService } from "./roomRound.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        TypeOrmModule.forFeature([RoomRound])
    ],
    controllers: [RoomRoundController],
    providers: [RoomRoundService],
    exports: [RoomRoundService],
})
export class RoomRoundModule {}