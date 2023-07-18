import { Body, Controller, Get, HttpStatus, Logger, Post, Res, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserGuestDTO } from '../user/dto/createUserGuest';
import { ResponseClient } from '../../common/types/responseClient';
import { Response } from 'express';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { expireTimeOneDay } from '../../common/variables/constVariable';
import { UserInterface } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logger: Logger = new Logger(AuthController.name),
    private redisService: RedisService,
    private configService: ConfigService,
    private userService: UserService,
  ) { }

  @Get('/register-guest')
  async registerAccount(
    @Res() response: Response,
  ): Promise<any> {
    try {
      const userInformation = this.userService.generateGuest();

      const user: User = await this.userService.createUser(userInformation);

      const accessToken = await this.authService.generateAccessToken({
        id: user.id
      });

      await this.redisService.setObjectByKeyValue(`USER:${user.id}`, accessToken, expireTimeOneDay);

      return response.status(HttpStatus.OK).json(
        {
          user: user,
          accessToken: accessToken,
        }
      );
    } catch (error) {
      this.logger.error(error);
      return response.status(error.statusCode | 500).json({
        statusCode: error.statusCode | 500,
        message: error,
        success: false,
        data: {},
      } as ResponseClient);
    }
  }
}
