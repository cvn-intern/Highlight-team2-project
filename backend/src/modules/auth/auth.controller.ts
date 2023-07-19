import { BadRequestException, Body, Controller, Get, HttpStatus, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { IdUser } from 'src/common/decorators/idUser';
import { AuthorizeJWT } from 'src/common/guards/authorizeJWT';
import { ResponseClient } from '../../common/types/responseClient';
import { expireTimeOneDay } from '../../common/variables/constVariable';
import { RedisService } from '../redis/redis.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

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

  @Post('google/login')
  @UseGuards(AuthorizeJWT)
  async handleGoogleLogin(@Body('token') token: string,
    @IdUser() userId: number,
    @Res() response: Response) {
    try {
      const tokenPayload = await this.authService.verifyGoogleLogin(token)
      if (!tokenPayload) throw new BadRequestException("Login google failed")

      const existingUser = await this .userService.getUserByIdProvider(tokenPayload.sub)
      
      if(existingUser)  return response.status(HttpStatus.OK).json(existingUser);

      const updatedUser = await this.userService.updateUser({
        id: userId,
        nickname: tokenPayload.name,
        avatar: tokenPayload.picture,
        id_provider: tokenPayload.sub,
        provider: 'google',
        is_guest: false
      })

      return response.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      this.logger.error(error)
      return response.status(error.status).json(error);
    }
  }
}
