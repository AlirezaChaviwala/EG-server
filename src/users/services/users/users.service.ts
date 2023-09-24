import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { ExistingUserDto } from 'src/auth/dtos/existing-user.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUser(
    existingUserObject: ExistingUserDto,
    filterObject?: object,
  ): Promise<User> {
    try {
      return await this.userModel.findOne(
        {
          email: existingUserObject.email,
        },
        filterObject,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await new this.userModel(createUserDto).save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
