import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  static encodePassword(rawPassword: string) {
    try {
      const SALT = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(rawPassword, SALT);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  static verifyPassword(rawPassword: string, hash: string) {
    try {
      return bcrypt.compareSync(rawPassword, hash);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
