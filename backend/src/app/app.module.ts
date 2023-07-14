import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageModule } from 'src/modules/language/language.module';
import { UserModule } from 'src/modules/user/user.module';
import { RoomModule } from 'src/modules/room/room.module';
import { RoomUserModule } from 'src/modules/roomUser/roomUser.module';
import { RoomRoundModule } from 'src/modules/roomRound/roomRound.module';
import { WordModule } from 'src/modules/word/word.module';
import { ThemeModule } from 'src/modules/theme/theme.module';
import { SocketModule } from 'src/modules/socket/socket.module';
import { RedisModule } from 'src/modules/redis/redis.module';
import { AuthModule } from 'src/modules/auth/auth.module';

const is_ssl: boolean = process.env.NODE_ENV === "production" ? true : false;

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
