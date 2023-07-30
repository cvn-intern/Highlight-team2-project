import { Body, Controller, Get, HttpStatus, Logger, Post, Put, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { AuthorizeJWT } from '../../common/guards/authorizeJWT';
import { UpdateUserDTO } from './dto/updateUser';
import { getFileAvatars } from '../../common/utils/helper';

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
    @Req() request: Request,
  ) {
    try {
      const hostBE: string = request.get('host');

      const avatars: Array<string> = (await getFileAvatars()).map((avatar: string) => {
        return `http://${hostBE}/${avatar}`;
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
