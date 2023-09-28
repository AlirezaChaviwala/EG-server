import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor() {}

  @UseGuards(AuthGuard())
  @Get('dashboard')
  async getDashboard(@Req() req: Request) {
    return { ...req.user };
  }
}
