import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserWordController } from "./userWord.controller";
import { UserWordService } from "./userWord.service";
import { UserWord } from "./userWord.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserWord])
    ],
    controllers: [UserWordController],
    providers: [UserWordService],
    exports: [UserWordService],
})
export class UserWordModule {}
