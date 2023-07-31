import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageModule } from '../modules/language/language.module';
import { UserModule } from '../modules/user/user.module';
import { RoomModule } from '../modules/room/room.module';
import { WordModule } from '../modules/word/word.module';
import { ThemeModule } from '../modules/theme/theme.module';
import { SocketModule } from '../modules/socket/socket.module';
import { RedisModule } from '../modules/redis/redis.module';
import { AuthModule } from '../modules/auth/auth.module';
import { RoomUserModule } from 'src/modules/room-user/roomUser.module';
import { RoomRoundModule } from 'src/modules/room-round/roomRound.module';
import { WordsCollectionModule } from 'src/modules/words-collection/wordsCollection.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    LanguageModule,
    UserModule,
    RoomModule,
    RoomUserModule,
    RoomRoundModule,
    WordModule,
    ThemeModule,
    SocketModule,
    RedisModule,
    AuthModule,
    WordsCollectionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: process.cwd() + '/src/public',
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
