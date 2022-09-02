import { Body, Controller, Delete, Get, Head, Header, HttpCode, HttpException, HttpStatus, Param, Patch, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { PaginateOptionsDto } from './dto/paginate-options.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { Request } from 'express';
import { QueryMongoIdDto } from './dto/query-id.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('JWT'))
  @Patch('profile')
  updateProfile(@Body(new ValidationPipe({ skipMissingProperties: true, whitelist: true, forbidNonWhitelisted: true })) body: CreateUserDto, @Req() req: Request): Promise<any>{
     return this.userService.findandUpdate(body, req.user['_id']);
  }

  @UseGuards(AuthGuard('JWT'))
  @Get('listing')
  async getUsers(@Query(new ValidationPipe({ skipMissingProperties: true, whitelist: true, forbidNonWhitelisted: true })) query: PaginateOptionsDto): Promise<any>{
  
    let options = {};
    const _query = this.userService.findAll(options);
    if(query.sort){
      _query.sort({
        createdAt: query.sort as any
      })
    }
    const page: number = parseInt(query.page as any) || 1;
    const limit = query.limit || 10;
    const total = await this.userService.count(options);
    const data = await _query.skip((page - 1) * limit).limit(limit).exec()
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total/limit)
    }
  }

  @UseGuards(AuthGuard('JWT'))
  @Get('friend/listing')
  friendListing(@Query(new ValidationPipe({ skipMissingProperties: true, whitelist: true, forbidNonWhitelisted: true })) query: PaginateOptionsDto, @Req() req: Request):Promise<any>{
    return  this.userService.friendListing(query, req.user['_id']);
  }

  @UseGuards(AuthGuard('JWT'))
  @Patch('friend/sendRequest')
  sendRequest(@Query(new ValidationPipe()) query: QueryMongoIdDto, @Req() req: Request): Promise<any>{
    return this.userService.sendFriendRequest(query, req.user['_id']);
  }


  @UseGuards(AuthGuard('JWT'))
  @Patch('friend/acceptRequest')
  acceptRequest(@Query(new ValidationPipe()) query: QueryMongoIdDto, @Req() req: Request): Promise<any>{
    return this.userService.acceptFriendRequest(query, req.user['_id']);
  }

  
  @UseGuards(AuthGuard('JWT'))
   @Delete('friend/deleteRequest')
   deleteRequest(@Query(new ValidationPipe()) query: QueryMongoIdDto, @Req() req: Request): Promise<any>{
    return this.userService.deleteFriendRequest(query, req.user['_id']);
   }

   @UseGuards(AuthGuard('JWT'))
   @Delete('friend/remove')
   deleteFriend(@Query(new ValidationPipe()) query: QueryMongoIdDto, @Req() req: Request): Promise<any>{
    return this.userService.removeFriend(query, req.user['_id']);
   }

}
