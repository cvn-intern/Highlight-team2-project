import { Body, Controller, Get, HttpStatus, Logger, Post, Res, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserGuestDTO } from '../user/dto/createUserGuest';
import { ResponseClient } from 'src/common/types/responseClient';
import { Response } from 'express';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { expireTimeOneDay } from 'src/common/variables/constVariable';
import { UserInterface } from '../user/user.interface';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logger: Logger = new Logger(AuthController.name),
    private redisService: RedisService,
    private configService: ConfigService,
  ) { }

  @Get('/register-guest')
  async registerAccount(
    @Res() response: Response,
  ): Promise<any> {
    try {
      const user = await this.authService.registerAccountGuest();

      const accessToken = await this.authService.generateAccessToken({
        id: user.id
      });

      await this.redisService.setObjectByKeyValue(`USER:${user.id}`, accessToken, expireTimeOneDay);

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Successfully!',
        success: true,
        data: {
          user: user,
          accessToken: accessToken,
        },
      })
    } catch (error) {
      this.logger.error(error);
      return response.status(error.statusCode | 500).json({
        statusCode: error.statusCode | 500,
        message: 'Anything is wrong!',
        success: false,
        data: {},
      } as ResponseClient)
    }
  }
}
