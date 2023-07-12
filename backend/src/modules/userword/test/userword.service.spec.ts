import { Test, TestingModule } from '@nestjs/testing';
import { UserwordService } from './userword.service';

describe('UserwordService', () => {
  let service: UserwordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserwordService],
    }).compile();

    service = module.get<UserwordService>(UserwordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
