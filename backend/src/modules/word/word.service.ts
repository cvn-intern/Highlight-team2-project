import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { Repository } from 'typeorm';
import { WordType } from '../words-collection/dto/createWordsCollection';
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
  async createWord(word: WordType, words_collection_id: number) {
    const newWord = this.wordRepository.create({
      ...word,
      words_collection_id,
    });
    await this.wordRepository.save(newWord);
    return newWord;
  }
  async deleteAllWordsInWordsCollection(words_collection_id: number) {
    await this.wordRepository.delete({ words_collection_id });
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

  async handleHintWord(wordAnswer: string, wordReceiver: string): Promise<string> {
    let hintWord = wordReceiver;
    const indexSpace = wordAnswer.indexOf(' ');
    if (!hintWord) {
      hintWord = '_'.repeat(wordAnswer.length);
      if (indexSpace >= 0) {
        hintWord =
          hintWord.slice(0, indexSpace) +
          wordAnswer.split('').at(indexSpace) +
          hintWord.slice(indexSpace + 1, hintWord.length);
      }
      return hintWord;
    }

    const indexs = [];
    hintWord.split('').forEach((char: string, index: number) => {
      if (char === '_') {
        indexs.push(index);
      }
    });

    const indexRandom = indexs[Math.floor(Math.random() * indexs.length)];
    hintWord =
      hintWord.slice(0, indexRandom) +
      wordAnswer.split('').at(indexRandom) +
      hintWord.slice(indexRandom + 1, hintWord.length);
    if (indexSpace >= 0) {
      hintWord =
        hintWord.slice(0, indexSpace) +
        wordAnswer.split('').at(indexSpace) +
        hintWord.slice(indexSpace + 1, hintWord.length);
    }

    return hintWord;
  }
}
