import { Body, Controller, Get, HttpStatus, Logger, Param, Post, Query, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDTO } from './dto/createRoom';
import { Response } from 'express';
import { AuthorizeJWT } from '../../common/guards/authorizeJWT';
import { ResponseClient } from '../../common/types/responseClient';
import { extractIdRoom } from '../../common/utils/helper';
import { IdUser } from '../../common/decorators/idUser';
import { RoomUserService } from '../room-user/roomUser.service';
import { Room } from './room.entity';

@Controller('rooms')
export class RoomController {
  constructor(
    private roomService: RoomService,
    private logger: Logger = new Logger(RoomController.name),
    private roomUserService: RoomUserService,
  ) { }

  @UseGuards(AuthorizeJWT)
  @Post()
  async createRoom(
    @Body(new ValidationPipe()) roomInformation: CreateRoomDTO,
    @Res() response: Response,
    @IdUser() idUser: number,
  ) {
    try {
      const newRoom: Room = await this.roomService.createNewRoom({
        ...roomInformation,
        host: idUser,
      });

      return response.status(HttpStatus.OK).json(newRoom);
    } catch (error) {
      this.logger.error(error);
      return response.status(error.statusCode | 500).json({
        message: 'Something is wrong!',
        statusCode: error.statusCode | 500,
        success: false,
      } as ResponseClient)
    }
  }

  @UseGuards(AuthorizeJWT)
  @Get('/quick-play')
  async getRoomQuickPlay(
    @Res() response: Response,
    @IdUser() IdUser: number,
  ) {
    try {
      const room = await this.roomService.randomRoomForQuickPlay();

      return response.status(HttpStatus.OK).json(room);
    } catch (error) {
      this.logger.error(error);
      return response.status(error.statusCode | 500).json({
        message: 'Something is wrong!',
        statusCode: error.statusCode | 500,
        success: false,
      } as ResponseClient)
    }
  }

  @UseGuards(AuthorizeJWT)
  @Get('/participants/:codeRoom')
  async getListUserOfRoom(
    @Param('codeRoom') codeRoom: string,
    @Res() response: Response,
    @IdUser() idUser: number,
  ) {
    try {
      const idRoom: number = extractIdRoom(codeRoom);
      const users = await this.roomUserService.getListUserOfRoom(idRoom);

      return response.status(HttpStatus.OK).json({
        message: `Get list user of room ${codeRoom} successfully!`,
        statusCode: HttpStatus.OK,
        success: true,
        data: JSON.parse(JSON.stringify(users).replaceAll('id_user', 'user')),
      } as ResponseClient);
    } catch (error) {
      this.logger.error(error);
      return response.status(error.statusCode | 500).json({
        message: 'Something is wrong!',
        statusCode: error.statusCode | 500,
        success: false,
      } as ResponseClient)
    }
  }
}
