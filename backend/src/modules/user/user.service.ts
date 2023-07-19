import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserInterface } from './user.interface';
import { randomString } from '../../common/utils/helper';
import { AVATAR_DEFAULT, LANGUAGE_DEFAULT } from './constant';

const LENGTH_STRING_RANDOM: number = 6;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async createUser(user: UserInterface): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateUser(user: UserInterface): Promise<User> {
    const userExisted = await this.userRepository.find({
      where: {
        id: user.id,
      },
    });

    if (!userExisted) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    return this.userRepository.save(user);
  }

  async getUserByIdProvider(idProvider: string): Promise<User> {
    const userExisted = await this.userRepository.findOne({
      where: {
        id_provider: idProvider,
      },
    });

    return userExisted;
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
}
