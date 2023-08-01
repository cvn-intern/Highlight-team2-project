import { Logger, Module } from '@nestjs/common';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { WordRepository } from './word.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Word])],
  controllers: [WordController],
  providers: [WordService, WordRepository, Logger],
  exports: [WordService, WordRepository],
})
export class WordModule {}
