import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWord } from './userWord.entity';
import { UserWordService } from './userWord.service';
import { UserWordController } from './userWord.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserWord])
    ],
    controllers: [UserWordController],
    providers: [UserWordService],
    exports: [UserWordService],
})
export class UserWordModule {}
