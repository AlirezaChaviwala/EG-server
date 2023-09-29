import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthModule } from './auth/auth.module';
import { HashingService } from './auth/utils/hashing/hashing.service';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    MongooseModule.forRoot(process.env.DB_URI),
    UsersModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    HashingService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(
    @InjectConnection() private readonly mongooseConnection: Connection,
  ) {
    console.log('Connected to', this.mongooseConnection.name);
  }
}
