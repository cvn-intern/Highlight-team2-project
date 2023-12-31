import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Theme } from './theme.entity';
import { Repository } from 'typeorm';
import { ThemeInterface } from './theme.interface';

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
  ) {}

  async getAllTheme(): Promise<Theme[]> {
    return await this.themeRepository.find();
  }

  async getThemeByLanguageCode(language_code: string): Promise<Theme[]> {
    return await this.themeRepository.find({ where: { language_code } });
  }

  async createNewTheme(theme: ThemeInterface): Promise<Theme> {
    return await this.themeRepository.save(theme);
  }
}
