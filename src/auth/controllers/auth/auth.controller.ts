import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { LoginUserDto } from 'src/auth/dtos/login-user.dto';
import { User } from 'src/users/schemas/user.schema';
import { SerializedUser } from 'src/auth/types';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/auth/utils/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Get('h')
  // @UsePipes(ValidationPipe)
  get() {
    console.log('get');
    // const isSuccessfulSignUp = this.usersService.signUp(createUserDto);
    // return isSuccessfulSignUp?
  }

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

  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  @UsePipes(ValidationPipe)
  async signIn(@Request() req): Promise<any> {
    return { User: req.user, message: 'User logged in successfully' };
    // try {
    //   return await this.authService.validateUser(loginUserDto);
    // } catch (error) {
    //   throw error;
    // }
  }
}
