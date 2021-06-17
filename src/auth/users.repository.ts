import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthCredential } from './dto/auth.credential';
import { User } from './users.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentials: AuthCredential): Promise<void> {
    const { username, password } = authCredentials;

    const newUser = new User();
    newUser.username = username;
    newUser.isConfirmed = false;
    newUser.salt = await bcrypt.genSalt();
    newUser.password = await this.hashPassword(password, newUser.salt);

    try {
      await newUser.save();
    } catch (error) {
      console.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Username already exist');
      }

      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(authCredentials: AuthCredential): Promise<string> {
    const { username, password } = authCredentials;

    const user = await this.findOne({ username });
    const isValidPassword = await user.validatePassword(password);

    if (user && isValidPassword) {
      return user.username;
    }

    return null;
  }

  private async hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }
}
