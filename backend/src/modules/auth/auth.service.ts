import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserInterface } from '../user/user.interface';
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

  async registerAccountGuest() {
    const userInformation = this.userService.generateGuest();
    const user: User = await this.userService.createUser(userInformation);

    return user;    
  }

  async generateAccessToken(payload: PayloadJWT) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESSKEY'),
      expiresIn: this.configService.get<string>('JWT_ACCESSKEY_EXPIRE'),
    });
  }
}
