import { Controller } from "@nestjs/common";
import { UserWordService } from "./userWord.service";

@Controller('user-word')
export class UserWordController {
    constructor(
        private userWordService: UserWordService,
    ) {}
}
