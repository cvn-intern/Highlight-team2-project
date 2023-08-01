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

  async createNewTheme(theme: ThemeInterface): Promise<Theme> {
    return await this.themeRepository.save(theme);
  }
}
