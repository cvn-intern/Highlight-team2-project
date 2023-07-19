import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

type PayloadJWT = {
  id: number;
}

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

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

  async verifyGoogleLogin(token: string): Promise<TokenPayload>{
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
  
      return ticket ? ticket.getPayload() : null
    } catch (error) {
      return null
    }
  }
}
