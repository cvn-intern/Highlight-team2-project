import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
  ) { }

  async getWordRandom(wordCollection: number): Promise<Word> {
    const words: Array<Word> = await this.wordRepository.find({
      where: {
        words_collection_id: wordCollection,
      },
    });

    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }
}
