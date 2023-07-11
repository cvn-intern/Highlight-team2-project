import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageModule } from 'src/modules/language/language.module';
import { UserModule } from 'src/modules/user/user.module';
import { RoomModule } from 'src/modules/room/room.module';
import { RoomuserModule } from 'src/modules/roomuser/roomuser.module';
import { RoomroundModule } from 'src/modules/roomround/roomround.module';
import { WordModule } from 'src/modules/word/word.module';
import { UserwordModule } from 'src/modules/userword/userword.module';
import { ThemeModule } from 'src/modules/theme/theme.module';

const is_ssl: boolean = process.env.NODE_ENV === "production" ? true : false;

@Module({
  imports: [
    LanguageModule,
    UserModule,
    RoomModule,
    RoomuserModule,
    RoomroundModule,
    WordModule,
    UserwordModule,
    ThemeModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (
        {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          synchronize: true,
          autoLoadEntities: true,
          ssl: is_ssl,
        }
      )  
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
