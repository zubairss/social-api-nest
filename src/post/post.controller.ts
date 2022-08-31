import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { query } from 'express';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //need Id of uploader - take it from auth token
  @Post('create')
  createPost(@Body() body): string{
    return "Create Posts";
  }

  @Get('feed')
  postFeed(@Query() query): string{
    return "Post Feed";
  }


}
