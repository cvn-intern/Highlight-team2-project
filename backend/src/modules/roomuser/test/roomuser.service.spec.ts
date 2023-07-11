import { Test, TestingModule } from '@nestjs/testing';
import { RoomuserService } from '../roomuser.service';

describe('RoomuserService', () => {
  let service: RoomuserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomuserService],
    }).compile();

    service = module.get<RoomuserService>(RoomuserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
