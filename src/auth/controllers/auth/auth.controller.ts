import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/schemas/user.schema';
import { SerializedUser } from 'src/users/types';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  AuthenticatedGuard,
  LocalAuthGuard,
} from 'src/auth/utils/local.auth.guard';

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

  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  // @UsePipes(ValidationPipe)
  async signIn(@Req() req: Request) {
    // console.log(req);
    console.log('signIn method');
    // return { User: req.user, message: 'User logged in successfully' };
    // try {
    //   return await this.authService.validateUser(loginUserDto);
    // } catch (error) {
    //   throw error;
    // }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('dashboard')
  async getDashboard(@Req() req: Request) {
    return req;
  }
}
