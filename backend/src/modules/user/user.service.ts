import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserInterface } from './user.interface';
import { randomString } from '../../common/utils/helper';
import { AVATAR_DEFAULT, LANGUAGE_DEFAULT } from './constant';
import { RedisService } from '../redis/redis.service';

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

  generateGuest(): UserInterface {
    const nicknameGuest: string = "user" + randomString(LENGTH_STRING_RANDOM);
    const avatar: string = AVATAR_DEFAULT;
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
}
