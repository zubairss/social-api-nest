import { Module, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './post.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
