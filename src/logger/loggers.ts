import { ConsoleLogger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorLog } from 'src/auth/utils/schemas/error-log.schema';

export class Logger extends ConsoleLogger {
  constructor(
    @InjectModel(ErrorLog.name) private errorLogModel: Model<ErrorLog>,
  ) {
    super();
  }

  async error(message: any, stack?: string, context?: string) {
    await new this.errorLogModel().save();
    super.error.apply(this, ...arguments);
  }
}
