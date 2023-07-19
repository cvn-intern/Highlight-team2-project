import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [UserModule, JwtModule, ConfigModule, RedisModule,],
  controllers: [AuthController],
  providers: [AuthService, Logger],
  exports: [AuthService],
})
export class AuthModule {}
