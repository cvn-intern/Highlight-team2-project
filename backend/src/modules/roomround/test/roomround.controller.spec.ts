import { Test, TestingModule } from '@nestjs/testing';
import { RoomroundController } from '../roomround.controller';

describe('RoomroundController', () => {
  let controller: RoomroundController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomroundController],
    }).compile();

    controller = module.get<RoomroundController>(RoomroundController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
