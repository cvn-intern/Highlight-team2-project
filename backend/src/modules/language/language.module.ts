import { Logger, Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './language.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language])
  ],
  controllers: [LanguageController],
  providers: [LanguageService, Logger],
  exports: [LanguageService],
})
export class LanguageModule {}
