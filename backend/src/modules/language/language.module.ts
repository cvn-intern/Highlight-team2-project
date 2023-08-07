import { Logger, Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './language.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Language]), JwtModule, UserModule],
  controllers: [LanguageController],
  providers: [LanguageService, Logger],
  exports: [LanguageService],
})
export class LanguageModule {}
