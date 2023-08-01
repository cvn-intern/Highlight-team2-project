import { Module, Logger } from '@nestjs/common';
import { WordsCollectionController } from './wordsCollection.controller';
import { WordsCollectionService } from './wordsCollection.service';
import { WordsCollection } from './wordsCollection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { WordsCollectionRepository } from './wordsCollection.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WordsCollection]), JwtModule, UserModule],
  controllers: [WordsCollectionController],
  providers: [WordsCollectionService, Logger, WordsCollectionRepository],
  exports: [WordsCollectionService],
})
export class WordsCollectionModule {}
