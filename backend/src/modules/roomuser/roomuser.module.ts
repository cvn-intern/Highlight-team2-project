import { Module } from '@nestjs/common';
import { RoomuserController } from './roomuser.controller';
import { RoomuserService } from './roomuser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomUser } from './roomuser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomUser])
  ],
  controllers: [RoomuserController],
  providers: [RoomuserService],
  exports: [RoomuserService],
})
export class RoomuserModule {}
