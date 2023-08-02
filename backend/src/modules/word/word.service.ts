import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { expireTimeOneDay } from 'src/common/variables/constVariable';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
    private redisService: RedisService,
  ) {}

  async getWordRandom(wordCollection: number, roomId: number): Promise<Word> {
    let words: Array<Word> = await this.wordRepository.find({
      where: {
        words_collection_id: wordCollection,
      },
    });
    const usedWords: Array<string> = await this.redisService.getObjectByKey(`${roomId}:WORDS`);

    if (usedWords) {
      words = words.filter((word: Word) => !usedWords.includes(word.word));
    }

    if (words.length === 0) {
      await this.deleteCacheUsedWordsForRoom(roomId);
      return this.getWordRandom(wordCollection, roomId);
    }

    const randomIndex = Math.floor(Math.random() * words.length);

    return words[randomIndex];
  }

  async cacheUsedWordsForRoom(roomId: number, word: string) {
    let words: Array<string> = await this.redisService.getObjectByKey(`${roomId}:WORDS`);

    if (!words) {
      words = [];
    }

    words.push(word);
    await this.redisService.setObjectByKeyValue(`${roomId}:WORDS`, words, expireTimeOneDay);
  }

  async deleteCacheUsedWordsForRoom(roomId: number) {
    return await this.redisService.deleteObjectByKey(`${roomId}:WORDS`);
  }
}
