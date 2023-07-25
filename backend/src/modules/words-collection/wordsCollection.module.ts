import { Module } from '@nestjs/common';
import { WordsCollectionController } from './wordsCollection.controller';
import { WordsCollectionService } from './wordsCollection.service';
import { WordsCollection } from './wordsCollection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WordsCollection])],
  controllers: [WordsCollectionController],
  providers: [WordsCollectionService],
  exports: [WordsCollectionService],
})
export class WordsCollectionModule {}
