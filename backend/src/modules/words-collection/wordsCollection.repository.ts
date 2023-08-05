import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordsCollection } from '../words-collection/wordsCollection.entity';
import { ALL_WORDS_COLLECTION, MY_WORDS_COLLECTION, OFFICIAL_WORDS_COLLECTION } from './constants';
import { Theme } from '../theme/theme.entity';
import { Word } from '../word/word.entity';

@Injectable()
export class WordsCollectionRepository extends Repository<WordsCollection> {
  constructor(
    @InjectRepository(WordsCollection)
    repository: Repository<WordsCollection>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async getWordsCollectionByQuery(type: number, language_code: string, creator_id: number): Promise<WordsCollection[]> {
    const queryBuilder = this.createQueryBuilder('words_collection').leftJoinAndMapOne(
      'words_collection.theme',
      Theme,
      'theme',
      'words_collection.theme_id = theme.id',
    );

    if (type == MY_WORDS_COLLECTION) {
      queryBuilder
        .where('words_collection.is_created_by_system = :is_created_by_system', { is_created_by_system: false })
        .andWhere('words_collection.creator_id = :creator_id', { creator_id });
    }
    if (type == OFFICIAL_WORDS_COLLECTION) {
      queryBuilder.where('words_collection.is_created_by_system = :is_created_by_system', {
        is_created_by_system: true,
      });
    }
    if (type == ALL_WORDS_COLLECTION) {
      queryBuilder.where(
        'words_collection.is_created_by_system = :is_created_by_system1 OR ( words_collection.is_created_by_system = :is_created_by_system2 AND words_collection.creator_id = :creator_id )',
        {
          is_created_by_system1: true,
          is_created_by_system2: false,
          creator_id,
        },
      );
    }
    if (language_code != 'all') {
      queryBuilder.andWhere('words_collection.language_code = :language_code', { language_code });
    }
    const words_collections = await queryBuilder.getMany();
    return words_collections;
  }

  async getWordsCollectionDetailById(id: number) {
    const words_collection = await this.createQueryBuilder('words_collection')
      .leftJoinAndMapOne('words_collection.theme', Theme, 'theme', 'words_collection.theme_id = theme.id')
      .leftJoinAndMapMany('words_collection.words_list', Word, 'word', 'word.words_collection_id = words_collection.id')
      .where('words_collection.id = :id', { id })
      .getOne();
    return words_collection;
  }

  async getWordsCollectionById(id: number) {
    const words_collection = await this.createQueryBuilder('words_collection')
      .leftJoinAndMapOne('words_collection.theme', Theme, 'theme', 'words_collection.theme_id = theme.id')
      .where('words_collection.id = :id', { id })
      .getOne();
    return words_collection;
  }

  async createWordsCollection(
    theme_id: number,
    language_code: string,
    creator_id: number,
    is_created_by_system: boolean,
  ): Promise<WordsCollection> {
    const newWordsCollection = this.create({
      theme_id,
      language_code,
      creator_id,
      is_created_by_system,
    });
    return await this.save(newWordsCollection);
  }

  async updateWordsCollection(
    id: number,
    theme_id: number,
    language_code: string,
    creator_id: number,
    is_created_by_system: boolean,
  ) {
    const words_collection = await this.findOneBy({ id });
    if (!words_collection) {
      return null;
    }
    return await this.save({
      id,
      theme_id,
      language_code,
      creator_id,
      is_created_by_system,
    });
  }

  async deleteWordsCollection(id: number) {
    await this.delete({ id });
  }
}
