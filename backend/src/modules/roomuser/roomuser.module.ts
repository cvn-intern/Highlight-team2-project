import { Logger, Module } from "@nestjs/common";
import { RoomUser } from "./roomUser.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { RoomUserService } from "./roomUser.service";
import { RoomUserController } from "./roomUser.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomUser]),
    JwtModule,
    UserModule,
  ],
  controllers: [RoomUserController],
  providers: [RoomUserService, Logger],
  exports: [RoomUserService],
})
export class RoomUserModule {}
