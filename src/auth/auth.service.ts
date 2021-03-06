import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthCredential } from './dto/auth.credential';
import { JwtPayload } from './jwt.payload.interface';
import { UserRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredential: AuthCredential): Promise<void> {
    return this.userRepository.signUp(authCredential);
  }

  async signIn(
    authCredential: AuthCredential,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredential,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid Credential');
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
