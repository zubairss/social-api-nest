import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query, ValidationPipe } from '@nestjs/common';
import { create } from 'domain';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.schema';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true})) createUserDto: CreateUserDto): Promise<any>{
    const result = this.authService.registerUser(createUserDto);
    return result;
  }

  @Post('login')
  @HttpCode(200)
  loginUser(@Body(new ValidationPipe({ skipMissingProperties: true, whitelist: true, forbidNonWhitelisted: true })) loginUserDto: LoginUserDto): Promise<any>{
    const result = this.authService.loginUser(loginUserDto);
    return result;
  }

  @Post('refresh')
  refreshToken(@Query('token') token){
    return "Refresh Token"
  }
  

}
