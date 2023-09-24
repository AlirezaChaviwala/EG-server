import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { ExistingUserDto } from 'src/auth/dtos/existing-user.dto';
import { LoginUserDto } from 'src/auth/dtos/login-user.dto';
import { UserExistsException } from 'src/auth/exceptions/UserExists.exception';
import { User } from 'src/users/schemas/user.schema';
import { SerializedUser } from 'src/auth/types/index';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class AuthService {
  constructor(@Inject(UsersService) private userService: UsersService) {}

  async registerUser(createUserDto: CreateUserDto): Promise<SerializedUser> {
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

  async validateUser(loginUserDto: LoginUserDto): Promise<SerializedUser> {
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
          return new SerializedUser(isExistingUser);
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
