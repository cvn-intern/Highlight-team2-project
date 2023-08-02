import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordsCollection } from '../words-collection/wordsCollection.entity';
import { MY_WORDS_COLLECTION, OFFICIAL_WORDS_COLLECTION } from './constants';
import { Theme } from '../theme/theme.entity';

@Injectable()
export class WordsCollectionRepository extends Repository<WordsCollection> {
  constructor(
    @InjectRepository(WordsCollection)
    repository: Repository<WordsCollection>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async getWordsCollectionByType(type: number, creator_id: number): Promise<WordsCollection[]> {
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
    const words_collections = await queryBuilder.getMany();
    return words_collections;
  }
}
