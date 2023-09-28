import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UsersService) private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    try {
      const existingUser = await this.usersService.findUser(
        { email: payload.email },
        { email: 1, name: 1 },
      );

      if (!existingUser) {
        throw new UnauthorizedException();
      }

      return { name: payload.name };
    } catch (error) {
      throw error;
    }
  }
}
