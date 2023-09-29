import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppLogger } from 'src/logger/loggers';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(AppLogger) private logger: AppLogger,
  ) {}

  async findUser(queryObject: Object, filterObject?: Object) {
    try {
      return await this.userModel.findOne(queryObject, filterObject);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      return await new this.userModel(createUserDto).save();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
