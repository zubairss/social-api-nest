import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { query } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { Request } from 'express';
import { PostPaginateOptionsDto } from './dto/paginate-options.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //need Id of uploader - take it from auth token
  @UseGuards(AuthGuard('JWT'))
  @Post('create')
  createPost(@Body(new ValidationPipe({ skipMissingProperties: true, whitelist: true, forbidNonWhitelisted: true })) body: CreatePostDto, @Req() req: Request): Promise<any>{
    return this.postService.createPost(body, req.user['_id']);
  }

  @UseGuards(AuthGuard('JWT'))
  @Get('feed')
  postFeed(@Query(new ValidationPipe({ skipMissingProperties: true, whitelist: true, forbidNonWhitelisted: true })) query: PostPaginateOptionsDto, @Req() req: Request): Promise<any>{    
    return this.postService.postFeed(query, req.user['_id']);
  }


}
