import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { Repository } from 'typeorm';
import { WordType } from '../words-collection/dto/createWordsCollection';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
  ) {}

  async getWordRandom(wordCollection: number): Promise<Word> {
    const words: Array<Word> = await this.wordRepository.find({
      where: {
        words_collection_id: wordCollection,
      },
    });

    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  async createWord(word: WordType, words_collection_id: number) {
    const newWord = this.wordRepository.create({
      ...word,
      words_collection_id,
    });
    await this.wordRepository.save(newWord);
    return newWord;
  }
}
