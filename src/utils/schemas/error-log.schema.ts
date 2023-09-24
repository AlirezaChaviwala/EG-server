import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class ErrorLog {
  @Prop({ required: true })
  name!: string;

  @Prop()
  errorCode?: number;

  @Prop({ required: true })
  message!: string;

  @Prop({ required: true })
  stackTrace!: string;
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLog);
