import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWord } from './userWord.entity';
import { UserWordController } from './userWord.controller';
import { UserwordService } from './userWord.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserWord])
    ],
    controllers: [UserWordController],
    providers: [UserwordService],
    exports: [UserwordService],
})
export class UserWordModule {}
