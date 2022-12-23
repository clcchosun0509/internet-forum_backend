import {
  Controller,
  Get,
  HttpStatus,
  Next,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entities';
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
  naverRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User | null;
    res.cookie('logged_in', true, {
      httpOnly: false,
    });
    res.cookie('email', user?.email, {
      httpOnly: false,
    });
    res.cookie('username', user?.username, {
      httpOnly: false,
    });
    res.cookie('avatar', user?.avatar, {
      httpOnly: false,
    });
    res.redirect(this.CLIENT_URL);
  }

  @Get('status')
  @UseGuards(AuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      return res.status(HttpStatus.OK).json({ status: 'success' });
    });
  }
}
