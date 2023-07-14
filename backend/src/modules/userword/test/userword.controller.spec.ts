import { Test, TestingModule } from '@nestjs/testing';
import { UserwordController } from '../userWord.controller';

describe('UserwordController', () => {
  let controller: UserwordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserwordController],
    }).compile();

    controller = module.get<UserwordController>(UserwordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
