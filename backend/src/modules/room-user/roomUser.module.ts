import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { RoomUser } from './roomUser.entity';
import { Logger, Module, forwardRef } from '@nestjs/common';
import { RoomUserController } from './roomUser.controller';
import { RoomUserService } from './roomUser.service';
import { RoomUserRepository } from './roomUser.repository';
import { RedisModule } from '../redis/redis.module';
import { RoomRoundModule } from '../room-round/roomRound.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomUser]),
    JwtModule,
    UserModule,
    RedisModule,
    forwardRef(() => RoomRoundModule),
  ],
  controllers: [RoomUserController],
  providers: [RoomUserService, Logger, RoomUserRepository],
  exports: [RoomUserService, RoomUserRepository],
})
export class RoomUserModule {}
