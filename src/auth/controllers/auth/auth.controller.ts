import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { SerializedUser } from 'src/users/types';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('signUp')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async signUp(@Body() createUserDto: CreateUserDto): Promise<SerializedUser> {
    try {
      return await this.authService.registerUser(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('signIn')
  @UsePipes(ValidationPipe)
  async signIn(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    console.log('signIn method');
    try {
      return await this.authService.validateUser(loginUserDto);
    } catch (error) {
      throw error;
    }
  }
}
