import { Body, Controller, Get, HttpStatus, Logger, Put, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthorizeJWT } from '../../common/guards/authorizeJWT';
import { UpdateUserDTO } from './dto/updateUser';
import { getFileAvatars } from '../../common/utils/helper';
import { app } from 'src/main';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger = new Logger(UserController.name),
  ) { }

  @UseGuards(AuthorizeJWT)
  @Put('/update-profile')
  async updateProfile(
    @Body(new ValidationPipe()) userInformation: UpdateUserDTO,
    @Res() response: Response,
  ) {
    try {
      const user = await this.userService.updateUser(userInformation);

      return response.status(HttpStatus.OK).json(user);
    } catch (error) {
      this.logger.error(error);
      return response.status(error.status).json(error);
    }
  }

  @UseGuards(AuthorizeJWT)
  @Get('/avatars')
  async getAvatars(
    @Res() response: Response,
  ) {
    try {
      const hostBE: string = await app.getUrl();
      const avatars: Array<string> = (await getFileAvatars()).map((avatar: string) => {
        return `${hostBE}/${avatar}`;
      });

      return response.status(HttpStatus.OK).json(
        avatars,
      );
    } catch (error) {
      this.logger.error(error);
      return response.status(error.status);
    }
  }
}
