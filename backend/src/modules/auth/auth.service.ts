import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';

type PayloadJWT = {
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }
  async generateAccessToken(payload: PayloadJWT) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESSKEY'),
      expiresIn: this.configService.get<string>('JWT_ACCESSKEY_EXPIRE'),
    });
  }
}
