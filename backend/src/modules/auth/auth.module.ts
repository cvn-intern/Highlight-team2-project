import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { OAuth2Client } from 'google-auth-library';

@Module({
  imports: [UserModule, JwtModule, ConfigModule, RedisModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    Logger,
    {
      provide: 'OAuth2Client',
      useFactory: () => {
        return new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
      },
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
