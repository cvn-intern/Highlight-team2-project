import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWord } from './userword.entity';
import { UserwordController } from './userword.controller';
import { UserwordService } from './userword.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserWord])
    ],
    controllers: [UserwordController],
    providers: [UserwordService],
    exports: [UserwordService],
})
export class UserwordModule {}
