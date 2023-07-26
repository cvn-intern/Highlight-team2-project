import { Body, Controller, Get, HttpStatus, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { IdUser } from 'src/common/decorators/idUser';
import { AuthorizeJWT } from 'src/common/guards/authorizeJWT';
import { expireTimeOneDay } from '../../common/variables/constVariable';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { RedisService } from '../redis/redis.service';
import { UserToken } from './types/userToken';

const DAYS_OF_YEAR = 365;

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logger: Logger = new Logger(AuthController.name),
    private redisService: RedisService,
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

      await this.redisService.setObjectByKeyValue(`USER:${user.id}:ACCESSTOKEN`, accessToken, expireTimeOneDay);

      return response.status(HttpStatus.OK).json(
        {
          user: user,
          accessToken: accessToken,
        }
      );
    } catch (error) {
      this.logger.error(error);
      return response.status(error.status).json(error);
    }
  }

  @Post('google/login')
  @UseGuards(AuthorizeJWT)
  async handleGoogleLogin(
    @Body('token') token: string,
    @IdUser() userId: number,
    @Res() response: Response,
  ) {
    try {
      const userToken: UserToken = await this.authService.googleLogin(token, userId);

      return response.status(HttpStatus.OK).json(userToken);
    } catch (error) {
      this.logger.error(error)
      return response.status(error.status).json(error);
    }
  }

  @UseGuards(AuthorizeJWT)
  @Post('/logout')
  async handleLogout(
    @Res() response: Response,
    @IdUser() idUser: number,
  ) {
    try {
      const userToken = await this.redisService.getObjectByKey(`USER:${idUser}:ACCESSTOKEN`);

      this.redisService.setObjectByKeyValue(`BLOCKLIST:${userToken}`, userToken, expireTimeOneDay * DAYS_OF_YEAR);
      const socketId = await this.redisService.getObjectByKey(`USER:${idUser}:SOCKET`);

      if(socketId) {
        this.redisService.deleteObjectByKey(`${socketId}:ACCESSTOKEN`);
      }
      
      this.redisService.deleteObjectByKey(`USER:${idUser}:SOCKET`);
      this.redisService.deleteObjectByKey(`USER:${idUser}:ACCESSTOKEN`);

      return response.status(HttpStatus.OK).json();
    } catch (error) {
      this.logger.error(error)
      return response.status(error.status).json(error);
    }
  }
}
