import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  index(): string{
    return "Users Route"
  }

  //get own id from token
  @Patch('profile')
  updateProfile(@Body() body): string{
    return "Update Profile"
  }

  @Get('listing')
  getUsers(@Query() query): string{
    return "User Listing"
  }

  //get own id from token
  @Patch('friend/sendRequest')
  sendRequest(@Query() query): string{
    return "Send Friend Request"
  }

  //get own id from token
  @Patch('friend/acceptRequest')
  acceptRequest(@Query() query): string{
    return "Accept Friend Request"
  }

   //get own id from token
   @Delete('friend/deleteRequet')
   deleteRequest(@Query() query): string{
     return "Delete Friend Request"
   }

   //get own id from token
   @Get('friend/listing')
   friendListing(@Query() query): string{
  
      return "Get Friend's Listing"
   }
 

  

}
