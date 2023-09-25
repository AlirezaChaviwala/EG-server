import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashingService } from 'src/auth/utils/hashing/hashing.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { ExistingUserDto } from 'src/users/dtos/existing-user.dto';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { UserExistsException } from 'src/users/exceptions/UserExists.exception';

import { User } from 'src/users/schemas/user.schema';

import { UsersService } from 'src/users/services/users/users.service';
import { SerializedUser } from 'src/users/types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    try {
      const existingUserObject: ExistingUserDto = {
        email: createUserDto.email,
      };
      const isExistingUser = await this.userService.findUser(
        existingUserObject,
        { email: 1 },
      );

      if (isExistingUser) {
        throw new UserExistsException(
          `User with email ${isExistingUser.email} already exists`,
        );
      } else {
        await this.userService.createUser(createUserDto);
        return new SerializedUser(createUserDto);
      }
    } catch (error) {
      if (error.status && error.status === HttpStatus.BAD_REQUEST) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async validateUser(loginUserDto: LoginUserDto) {
    try {
      const existingUserObject: ExistingUserDto = {
        email: loginUserDto.email,
      };

      const isExistingUser = await this.userService.findUser(
        existingUserObject,
        { name: 1, email: 1, password: 1 },
      );

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
