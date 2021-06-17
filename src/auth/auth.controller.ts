import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthCredential } from './dto/auth.credential';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredential: AuthCredential,
  ): Promise<void> {
    return this.authService.signUp(authCredential);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authCredential: AuthCredential,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredential);
  }
}
