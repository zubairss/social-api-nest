import { Body, Controller, Delete, Get, Head, Header, HttpCode, HttpException, HttpStatus, Param, Patch, Query, Req, ValidationPipe } from '@nestjs/common';
import { PaginateOptionsDto } from './dto/paginate-options.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { Request } from 'express';
import { QueryMongoIdDto } from './dto/query-id.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  index(): string{
    return "Users Route"
  }

  //get own id from token
  @Patch('profile')
  updateProfile(@Body(new ValidationPipe({ skipMissingProperties: true, whitelist: true, forbidNonWhitelisted: true })) body: UpdateUserDto, @Req() req: Request): Promise<any>{
    const authHeader = req.headers.authorization;
    const authToken = authHeader && authHeader.split(' ')[1];

    if(authToken == null) {
      throw new HttpException("Can't Get User ID", HttpStatus.BAD_REQUEST)
    }

    return this.userService.findandUpdate(body, authToken);
  }

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

  //get own id 1from token
  @Patch('friend/sendRequest')
  sendRequest(@Query(new ValidationPipe()) query: QueryMongoIdDto, @Req() req: Request): Promise<any>{
    const authHeader = req.headers.authorization;
    const authToken = authHeader && authHeader.split(' ')[1];

    if(authToken == null) {
      throw new HttpException("Can't Get User ID", HttpStatus.BAD_REQUEST)
    }

    return this.userService.sendFriendRequest(query, authToken);
  }

  //get own id from token
  @Patch('friend/acceptRequest')
  acceptRequest(@Query() query): string{
    return "Accept Friend Request"
  }

   //get own id from token
   @Delete('friend/deleteRequest')
   deleteRequest(@Query(new ValidationPipe()) query: QueryMongoIdDto, @Req() req: Request): Promise<any>{
    const authHeader = req.headers.authorization;
    const authToken = authHeader && authHeader.split(' ')[1];

    if(authToken == null) {
      throw new HttpException("Can't Get User ID", HttpStatus.BAD_REQUEST)
    }

    return this.userService.deleteFriendRequest(query, authToken);
   }

   //get own id from token
   @Get('friend/listing')
   friendListing(@Query() query): string{
  
      return "Get Friend's Listing"
   }
 

  

}
