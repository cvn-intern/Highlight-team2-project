import { Body, Controller, Get, HttpStatus, Logger, Param, Post, Query, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDTO } from './dto/createRoom';
import { Response } from 'express';
import { AuthorizeJWT } from '../../common/guards/authorizeJWT';
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

   // @UseGuards(AuthorizeJWT)
   @Get()
   getRooms(
     @Req() request: Request
   ) {
     try {
       console.log("room list")
       this.logger.log("room list")
       return "this"
 
     } catch (error) {
       this.logger.error(error);      
     }
   }

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
      return response.status(error.status).json(error);
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
      return response.status(error.status).json(error);
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
      const room: Room = await this.roomService.getRoomByCodeRoom(codeRoom);
      const users = await this.roomUserService.getListUserOfRoom(idRoom);

      return response.status(HttpStatus.OK).json({
        users: JSON.parse(JSON.stringify(users).replaceAll('id_user', 'user')),
        max_player: room.max_player,
      });
    } catch (error) {
      this.logger.error(error);
      return response.status(error.status).json(error);
    }
  }
}


