import { Module, Logger } from '@nestjs/common';
import { WordsCollectionController } from './wordsCollection.controller';
import { WordsCollectionService } from './wordsCollection.service';
import { WordsCollection } from './wordsCollection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { WordsCollectionRepository } from './wordsCollection.repository';
import { WordModule } from '../word/word.module';
import { WordService } from '../word/word.service';
import { WordRepository } from '../word/word.repository';
import { Word } from '../word/word.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WordsCollection, Word]),
    JwtModule,
    UserModule,
    WordModule,
    RedisModule
  ],
  controllers: [WordsCollectionController],
  providers: [
    WordsCollectionService,
    Logger,
    WordsCollectionRepository,
    WordRepository,
    WordService,
  ],
  exports: [WordsCollectionService],
})
export class WordsCollectionModule {}
