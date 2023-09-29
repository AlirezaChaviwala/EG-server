import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/services/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { HashingService } from './utils/hashing/hashing.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './utils/jwt.strategy';
import { AppLogger } from 'src/logger/loggers';
import { ErrorLog, ErrorLogSchema } from 'src/logger/schemas/error-log.schema';
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
    MongooseModule.forFeature([
      {
        name: ErrorLog.name,
        schema: ErrorLogSchema,
      },
    ]),
    forwardRef(() => UsersModule),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_MAX_AGE'),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy, AppLogger],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
