import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, ValidationPipe } from '@nestjs/common';
import { create } from 'domain';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.schema';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  index(): string{
    return "Auth Route"
  }


  @Post('register')
  registerUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<any>{
    console.log("Register Controller")
    const result = this.authService.registerUser(createUserDto);
    return result;
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
