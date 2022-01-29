import { Test, TestingModule } from '@nestjs/testing';
import { OrgsController } from './orgs.controller';

describe('OrgsController', () => {
  let controller: OrgsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgsController],
    }).compile();

    controller = module.get<OrgsController>(OrgsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
