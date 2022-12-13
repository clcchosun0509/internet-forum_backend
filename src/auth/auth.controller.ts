import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

import { NaverOAuthGuard } from './guards/naver-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}
  private readonly CLIENT_URL = this.configService.get<string>('CLIENT_URL');

  @Get('naver')
  @UseGuards(NaverOAuthGuard)
  naverLogin() {}

  @Get('naver/callback')
  @UseGuards(NaverOAuthGuard)
  naverRedirect(@Res() res: Response) {
    res.cookie('logged_in', true, {
      httpOnly: false,
    });
    res.redirect(this.CLIENT_URL);
  }

  @Get('status')
  @UseGuards(AuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }
}
