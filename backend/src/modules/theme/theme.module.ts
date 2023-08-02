import { Logger, Module } from '@nestjs/common';
import { ThemeController } from './theme.controller';
import { ThemeService } from './theme.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theme } from './theme.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Theme]), JwtModule, UserModule],
  controllers: [ThemeController],
  providers: [ThemeService, Logger],
  exports: [ThemeService],
})
export class ThemeModule {}
