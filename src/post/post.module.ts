import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), JwtModule.register({
    secret: "CitrusBits",
    signOptions: {expiresIn: '1000000s'}
  })],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
