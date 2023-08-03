import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserInterface } from './user.interface';
import { getFileAvatars, randomString } from '../../common/utils/helper';
import { LANGUAGE_DEFAULT } from './constant';
import { RedisService } from '../redis/redis.service';
import { daysOfYear, expireTimeOneDay } from 'src/common/variables/constVariable';

const LENGTH_STRING_RANDOM = 6;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private redisService: RedisService,
  ) {}

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

    const isAvatarIndefault = await this.checkAvatarInDefault(user.avatar);
    if (!user.provider && !isAvatarIndefault) {
      throw new HttpException('Avatar is not in default avatars!', HttpStatus.BAD_REQUEST);
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

  async generateGuest(hostBE: string): Promise<UserInterface> {
    let avatars: Array<string> = await this.redisService.getObjectByKey('DEFAULT_AVATARS');

    if (!avatars) {
      avatars = (await getFileAvatars()).map((avatar: string) => {
        return `http://${hostBE}/${avatar}`;
      });

      this.cacheAvatar(avatars);
    }

    const nicknameGuest: string = 'user' + randomString(LENGTH_STRING_RANDOM);
    const avatar: string = avatars[0];
    const language: string = LANGUAGE_DEFAULT;

    return {
      nickname: nicknameGuest,
      avatar: avatar,
      language: language,
    } as UserInterface;
  }

  async cacheAvatar(avatars: Array<string>) {
    return await this.redisService.setObjectByKeyValue('DEFAULT_AVATARS', avatars, expireTimeOneDay * daysOfYear);
  }

  async checkAccessTokenOfUserInBlocklist(tokenUser: string): Promise<boolean> {
    const check = await this.redisService.getObjectByKey(`BLOCKLIST:${tokenUser}`);

    return !!check;
  }

  async isGuest(userId: number): Promise<boolean> {
    const user: User = await this.getUserById(userId);
    if (!user) return false;
    return user.is_guest;
  }

  async checkAvatarInDefault(avatar: string): Promise<boolean> {
    const avatars: Array<string> = await this.redisService.getObjectByKey('DEFAULT_AVATARS');

    return !!avatars.includes(avatar);
  }
}
