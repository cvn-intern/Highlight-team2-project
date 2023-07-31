import { Controller, Logger } from "@nestjs/common";
import { RoomUserService } from "./roomUser.service";

@Controller('room-user')
export class RoomUserController {
  constructor(
    private roomUserService: RoomUserService,
    private logger: Logger = new Logger(RoomUserController.name),
  ) { }
}
