import { IsNotEmpty, IsEmail } from 'class-validator';

export class ErrorLogDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
