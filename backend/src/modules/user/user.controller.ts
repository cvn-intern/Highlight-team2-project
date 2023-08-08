import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Patch,
  Put,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthorizeJWT } from '../../common/guards/authorizeJWT';
import { UpdateUserDTO } from './dto/updateUser';
import { RedisService } from '../redis/redis.service';
import { IdUser } from 'src/common/decorators/idUser';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger = new Logger(UserController.name),
    private redisService: RedisService,
  ) {}

  @UseGuards(AuthorizeJWT)
  @Put('/update-profile')
  async updateProfile(@Body(new ValidationPipe()) userInformation: UpdateUserDTO, @Res() response: Response) {
    try {
      const user = await this.userService.updateUser(userInformation);

      return response.status(HttpStatus.OK).json(user);
    } catch (error) {
      this.logger.error(error);
      return response.status(error.status).json(error);
    }
  }

  @UseGuards(AuthorizeJWT)
  @Patch('/update-language')
  async updateLanguage(
    @Query('language_code') language_code: string,
    @Res() response: Response,
    @IdUser() idUser: number,
  ) {
    try {
      const user = await this.userService.updateLanguage(idUser, language_code);
      return response.status(HttpStatus.OK).json(user);
    } catch (error) {
      this.logger.error(error);
      return response.status(error.status).json(error);
    }
  }

  @UseGuards(AuthorizeJWT)
  @Get('/avatars')
  async getAvatars(@Res() response: Response) {
    try {
      const avatars: Array<string> = await this.redisService.getObjectByKey('DEFAULT_AVATARS');

      return response.status(HttpStatus.OK).json(avatars ? avatars : []);
    } catch (error) {
      this.logger.error(error);
      return response.status(error.status);
    }
  }
}
