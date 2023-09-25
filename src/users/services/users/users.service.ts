import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUser(queryObject: Object, filterObject?: Object) {
    try {
      return await this.userModel.findOne(queryObject, filterObject);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      return await new this.userModel(createUserDto).save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findById(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
