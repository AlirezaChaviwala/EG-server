import { Logger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorLog } from './schemas/error-log.schema';

@Injectable()
export class AppLogger extends Logger {
  constructor(
    @InjectModel(ErrorLog.name) private errorLogModel: Model<ErrorLog>,
  ) {
    super();
  }

  async error(message: string, trace: string) {
    try {
      super.error(message, trace);

      await this.errorLogModel.create({
        message,
        stackTrace: trace,
      });
    } catch (error) {
      console.error(`Failed to save error to database: ${error.message}`);
    }
  }
}
