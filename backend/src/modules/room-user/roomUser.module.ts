import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { RoomUser } from "./roomUser.entity";
import { Logger, Module } from "@nestjs/common";
import { RoomUserController } from "./roomUser.controller";
import { RoomUserService } from "./roomUser.service";
import { RoomUserRepository } from "./roomUser.repository";

@Module({
    imports: [
      TypeOrmModule.forFeature([RoomUser]),
      JwtModule,
      UserModule,
    ],
    controllers: [RoomUserController],
    providers: [RoomUserService, Logger, RoomUserRepository],
    exports: [RoomUserService, RoomUserRepository],
  })
  export class RoomUserModule {}