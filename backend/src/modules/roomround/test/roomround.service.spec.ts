import { Test, TestingModule } from '@nestjs/testing';
import { RoomroundService } from './roomround.service';

describe('RoomroundService', () => {
  let service: RoomroundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomroundService],
    }).compile();

    service = module.get<RoomroundService>(RoomroundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
