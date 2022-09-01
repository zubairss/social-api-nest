import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req, ValidationPipe } from '@nestjs/common';
import { query } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { Request } from 'express';
import { PostPaginateOptionsDto } from './dto/paginate-options.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //need Id of uploader - take it from auth token
  @Post('create')
  createPost(@Body(new ValidationPipe({ skipMissingProperties: true, whitelist: true, forbidNonWhitelisted: true })) body: CreatePostDto, @Req() req: Request): Promise<any>{
    const authHeader = req.headers.authorization;
    const authToken = authHeader && authHeader.split(' ')[1];

    if(authToken == null) {
      throw new HttpException("Can't Get User ID", HttpStatus.BAD_REQUEST)
    }

    return this.postService.createPost(body, authToken);
  }

  @Get('feed')
  postFeed(@Query(new ValidationPipe({ skipMissingProperties: true, whitelist: true, forbidNonWhitelisted: true })) query: PostPaginateOptionsDto, @Req() req: Request): Promise<any>{
    const authHeader = req.headers.authorization;
    const authToken = authHeader && authHeader.split(' ')[1];

    if(authToken == null) {
      throw new HttpException("Can't Get User ID", HttpStatus.BAD_REQUEST)
    }
    
    return ;
  }


}
