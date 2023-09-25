import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { SessionSerializer } from 'src/auth/utils/session.serializer';
import { LocalStrategy } from 'src/auth/utils/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { AuthenticatedGuard } from 'src/auth/utils/local.auth.guard';
import { HashingService } from 'src/auth/utils/hashing/hashing.service';

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
    // PassportModule.register({
    //   session: true,
    // }),
  ],
  controllers: [UsersController],
  providers: [UsersService, LocalStrategy, SessionSerializer, AuthService],
})
export class UsersModule {}
