import { Logger, Module, forwardRef } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { RoomRoundModule } from '../roomround/roomRound.module';
import { RoomUserModule } from '../roomUser/roomUser.module';
import { RoomUserService } from '../roomuser/roomUser.service';
import { RoomUser } from '../roomUser/roomUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomUser]),
    JwtModule,
    UserModule,
    RoomRoundModule,
    RoomUserModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, Logger, RoomUserService],
  exports: [RoomService],
})
export class RoomModule {}
