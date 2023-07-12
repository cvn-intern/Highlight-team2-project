import { Test, TestingModule } from '@nestjs/testing';
import { RoomuserController } from './roomuser.controller';

describe('RoomuserController', () => {
  let controller: RoomuserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomuserController],
    }).compile();

    controller = module.get<RoomuserController>(RoomuserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
