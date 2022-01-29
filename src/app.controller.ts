import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('isalive')
  isalive(): boolean {
    return true;
  }
}
