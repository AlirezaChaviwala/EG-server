import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password should be of minimum 8 characters',
  })
  @MaxLength(16, {
    message: 'Password should be of maximum 16 characters',
  })
  @Matches(/.*[0-9].*/, {
    message: 'Password should contain atleast 1 digit',
  })
  @Matches(/.*[a-zA-Z].*/, {
    message: 'Password should contain atleast 1 letter',
  })
  @Matches(/.*[^a-zA-Z0-9\s].*/, {
    message: 'Password should contain atleast 1 special character',
  })
  password: string;
}
