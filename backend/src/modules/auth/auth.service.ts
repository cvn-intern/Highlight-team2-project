import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { RedisService } from '../redis/redis.service';
import { expireTimeOneDay } from 'src/common/variables/constVariable';
import { UserToken } from './types/userToken';

type PayloadJWT = {
  id: number;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
    @Inject('OAuth2Client') private client: OAuth2Client,
  ) { }
  async generateAccessToken(payload: PayloadJWT) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESSKEY'),
      expiresIn: this.configService.get<string>('JWT_ACCESSKEY_EXPIRE'),
    });
  }

  async verifyGoogleLogin(token: string): Promise<TokenPayload> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      return ticket ? ticket.getPayload() : null;
    } catch (error) {
      return null;
    }
  }

  async googleLogin(token: string, userId: number): Promise<UserToken> {
    const tokenPayload = await this.verifyGoogleLogin(token);
    if (!tokenPayload) throw new BadRequestException('Login google failed');

    const existingUser = await this.userService.getUserByIdProvider(tokenPayload.sub);

    if (existingUser) {
      const accessToken = await this.generateAccessToken({
        id: existingUser.id,
      });

      await Promise.all([
        await this.redisService.deleteObjectByKey(`USER:${userId}:ACCESSTOKEN`),
        await this.redisService.deleteObjectByKey(`USER:${userId}:SOCKET`),
        await this.redisService.setObjectByKeyValue(`USER:${existingUser.id}:ACCESSTOKEN`, accessToken, expireTimeOneDay),
      ]);

      return {
        user: existingUser,
        accessToken: accessToken,
      } as UserToken;
    }

    const updatedUser = await this.userService.updateUser({
      id: userId,
      nickname: tokenPayload.name,
      avatar: tokenPayload.picture,
      id_provider: tokenPayload.sub,
      provider: 'google',
      is_guest: false,
    });

    const accessToken = await this.generateAccessToken({
      id: userId,
    });

    await this.redisService.setObjectByKeyValue(`USER:${updatedUser.id}:ACCESSTOKEN`, accessToken, expireTimeOneDay);

    return {
      user: updatedUser,
      accessToken: accessToken,
    } as UserToken;
  }

  async logoutGoogle(userId: number): Promise<boolean> {
    const userToken = await this.redisService.getObjectByKey(`USER:${userId}:ACCESSTOKEN`);

    this.redisService.setObjectByKeyValue(`BLOCKLIST:${userToken}`, userToken, expireTimeOneDay);

    return true;
  }
}
