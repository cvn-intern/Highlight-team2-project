import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserInterface } from './user.interface';
import { randomString } from 'src/common/utils/helper';

const LENGTH_STRING_RANDOM: number = 6;
const AVATAR_DEFAULT: string = "https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createUser(user: UserInterface) {
        return this.userRepository.save(user);
    }

    generateGuest() {
        const nicknameGuest: string = "user" + randomString(LENGTH_STRING_RANDOM);
        const avatar: string = AVATAR_DEFAULT;
        const language: string = 'en';

        return {
            nickname: nicknameGuest,
            avatar: avatar,
            language: language,
        } as UserInterface;
    }
}
