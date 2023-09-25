import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {
    super();
  }

  // constructor(@InjectModel(User.name) private userModel: Model<User>) {
  //   super();
  // }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    console.log('ser');
    console.log('user', user);
    done(null, user);
  }

  async deserializeUser(user: any, done: (err: Error, user: any) => void) {
    console.log('des');
    console.log('user', user);
    const userObject = { email: user.email, name: user.name };
    const existingUser = await this.usersService.findUser(userObject);

    if (existingUser) {
      console.log('here');
      return done(null, existingUser);
    } else {
      return done(null, null);
    }
  }
}
