import { Body, Controller, Get, HttpStatus, Logger, Post, Put, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserGuestDTO } from './dto/createUserGuest';
import { Response } from 'express';
import { ResponseClient } from '../../common/types/responseClient';
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

      return response.status(HttpStatus.OK).json({
        message: 'Update user profile successfully!',
        success: true,
        statusCode: HttpStatus.OK,
        data: {
          user
        },
      } as ResponseClient)
    } catch (error) {
      this.logger.error(error);
      return response.status(error.statusCode | HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something is wrong!',
        success: false,
        statusCode: error.statusCode | HttpStatus.INTERNAL_SERVER_ERROR,
      } as ResponseClient);
    }
  }
}
