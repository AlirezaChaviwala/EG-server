import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { HashingService } from 'src/auth/utils/hashing/hashing.service';
import { AuthModule } from 'src/auth/auth.module';
import { AppLogger } from 'src/logger/loggers';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function () {
            this.password = HashingService.encodePassword(this.password);
          });
          return schema;
        },
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, AppLogger],
})
export class UsersModule {}
