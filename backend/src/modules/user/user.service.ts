import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserInterface } from './user.interface';
import { getFileAvatars, randomString } from '../../common/utils/helper';
import { LANGUAGE_DEFAULT } from './constant';
import { RedisService } from '../redis/redis.service';
import { app } from 'src/main';

const LENGTH_STRING_RANDOM: number = 6;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private redisService: RedisService,
  ) { }

  async getUserById(userId: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async createUser(user: UserInterface): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateUser(user: UserInterface): Promise<User> {
    const isUserExisted = await this.userRepository.find({
      where: {
        id: user.id,
      },
    });

    if (!isUserExisted) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    if(!user.provider) {
      const isAvatarIndefault = await this.checkAvatarInDefault(user.avatar);
  
      if (!isAvatarIndefault) {
        throw new HttpException('Avatar is not in default avatars!', HttpStatus.BAD_REQUEST);
      }
    }

    return this.userRepository.save(user);
  }

  async getUserByIdProvider(idProvider: string): Promise<User> {
    const isUserExisted = await this.userRepository.findOne({
      where: {
        id_provider: idProvider,
      },
    });

    return isUserExisted;
  }

  async generateGuest(): Promise<UserInterface> {
    const hostBE: string = await app.getUrl();
    const avatars: Array<string> = (await getFileAvatars()).map((avatar: string) => {
      return `${hostBE}/${avatar}`;
    });
    const nicknameGuest: string = "user" + randomString(LENGTH_STRING_RANDOM);
    const avatar: string = avatars[0];
    const language: string = LANGUAGE_DEFAULT;

    return {
      nickname: nicknameGuest,
      avatar: avatar,
      language: language,
    } as UserInterface;
  }

  async checkAccessTokenOfUserInBlocklist(tokenUser: string): Promise<boolean> {
    const check = await this.redisService.getObjectByKey(`BLOCKLIST:${tokenUser}`);

    return !!check;
  }

  async isGuest(userId: number): Promise<boolean> {
    const user: User = await this.getUserById(userId);

    return user.is_guest;
  }

  async checkAvatarInDefault(avatar: string): Promise<boolean> {
    const hostBE: string = await app.getUrl();
    const avatars: Array<string> = (await getFileAvatars()).map((avatar: string) => {
      return `${hostBE}/${avatar}`;
    });

    return !!avatars.includes(avatar);
  }
}
