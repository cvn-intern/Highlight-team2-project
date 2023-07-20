import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { IdUser } from 'src/common/decorators/idUser';
import { AuthorizeJWT } from 'src/common/guards/authorizeJWT';
import { expireTimeOneDay } from '../../common/variables/constVariable';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { RedisService } from '../redis/redis.service';

const DAY_OF_YEAR = 365;

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
      const tokenPayload = await this.authService.verifyGoogleLogin(token);
      if (!tokenPayload) throw new BadRequestException("Login google failed");

      const existingUser = await this.userService.getUserByIdProvider(tokenPayload.sub);

      if (existingUser) {
        const accessToken = await this.authService.generateAccessToken({
          id: existingUser.id
        });

        const isLogin = await this.redisService.getObjectByKey(`USER:${existingUser.id}:ACCESSTOKEN`);

        if (isLogin) {
          throw new HttpException('Logined in another device!', HttpStatus.NOT_ACCEPTABLE);
        }

        await this.redisService.setObjectByKeyValue(`USER:${existingUser.id}:ACCESSTOKEN`, accessToken, expireTimeOneDay);

        return response.status(HttpStatus.OK).json({
          user: existingUser,
          accessToken: accessToken,
        });
      }

      const updatedUser = await this.userService.updateUser({
        id: userId,
        nickname: tokenPayload.name,
        avatar: tokenPayload.picture,
        id_provider: tokenPayload.sub,
        provider: 'google',
        is_guest: false,
      });

      const accessToken = await this.authService.generateAccessToken({
        id: userId,
      });

      await this.redisService.setObjectByKeyValue(`USER:${updatedUser.id}:ACCESSTOKEN`, accessToken, expireTimeOneDay);

      return response.status(HttpStatus.OK).json({
        user: updatedUser,
        accessToken: accessToken,
      });
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
      await this.redisService.setObjectByKeyValue(`BLOCKLIST:${userToken}`, userToken, expireTimeOneDay * DAY_OF_YEAR);
      await this.redisService.deleteObjectByKey(`USER:${idUser}:SOCKET`);
      await this.redisService.deleteObjectByKey(`USER:${idUser}:ACCESSTOKEN`);

      return response.status(HttpStatus.OK).json();
    } catch (error) {
      this.logger.error(error)
      return response.status(error.status).json(error);
    }
  }
}
