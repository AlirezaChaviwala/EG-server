import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { ExistingUserDto } from 'src/users/dtos/existing-user.dto';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string) {
    const loginUserObject: LoginUserDto = {
      email: email.toLowerCase(),
      password,
    };
    const user = await this.validateUser(loginUserObject);
    console.log('LocalStrategy', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async validateUser(loginUserDto: LoginUserDto) {
    try {
      const existingUserObject: ExistingUserDto = {
        email: loginUserDto.email,
      };

      const isExistingUser = await this.userModel.findOne(existingUserObject, {
        name: 1,
        email: 1,
        password: 1,
      });

      if (isExistingUser) {
        const passwordMatch = HashingService.verifyPassword(
          loginUserDto.password,
          isExistingUser.password,
        );

        if (passwordMatch) {
          return { email: isExistingUser.email, name: isExistingUser.name };
        } else {
          throw new UnauthorizedException();
        }
      } else {
        throw new NotFoundException(
          `User with email ${loginUserDto.email} does not exist`,
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
