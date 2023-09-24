import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth/auth.service';
import { LoginUserDto } from '../dtos/login-user.dto';
import { SerializedUser } from '../types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super();
  }
  async validate(email: string, password: string): Promise<SerializedUser> {
    const loginUserObject: LoginUserDto = {
      email: email.toLowerCase(),
      password,
    };
    const user = await this.authService.validateUser(loginUserObject);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
