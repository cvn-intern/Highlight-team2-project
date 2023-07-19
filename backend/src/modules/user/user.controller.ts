import { Body, Controller, Get, HttpStatus, Logger, Post, Put, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthorizeJWT } from '../../common/guards/authorizeJWT';
import { UpdateUserDTO } from './dto/updateUser';

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
}
