import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './language.entity';
import { getLanguages } from '../../common/utils/helper';

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
    const listLanguage = await getLanguages();
    for (const language of listLanguage) {
      await this.languageRepository.save({
        ...language,
      })
    }
  }
}
