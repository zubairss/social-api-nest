import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  index(): string{
    return "Auth Route"
  }


  @Post('register')
  registerUser(@Body() body): string{
    return "User Signup"
  }

  @Post('login')
  loginUser(@Body() body): string{
    return "User Login"
  }

  @Post('refreshToken')
  refreshToken(@Query('token') token){
    return "Refresh Token"
  }
  

}
