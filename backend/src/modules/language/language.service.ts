import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './language.entity';
import { readFileLanguage } from '../../common/utils/helper';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) { }

  async getAllLanguge() {
    return this.languageRepository.find();
  }

  async initLanguageForDb() {
    const listLanguage = await readFileLanguage();
    for (const language of listLanguage) {
      await this.languageRepository.save({
        ...language,
      })
    }
  }
}
