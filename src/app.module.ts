import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { HashingService } from './auth/utils/hashing/hashing.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UsersModule,
    AuthModule,
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, HashingService],
})
export class AppModule {
  constructor(
    @InjectConnection() private readonly mongooseConnection: Connection,
  ) {
    console.log('Connected to', this.mongooseConnection.name);
  }
}
