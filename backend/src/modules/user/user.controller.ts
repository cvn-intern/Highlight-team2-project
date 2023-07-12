import { Body, Controller, Get, HttpStatus, Logger, Post, Res, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserGuestDTO } from './dto/createUserGuest';
import { Response } from 'express';
import { ResponseClient } from 'src/common/types/responseClient';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger = new Logger(UserController.name),
  ) { }
}
