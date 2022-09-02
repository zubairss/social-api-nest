import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { AccessTokenStrategy } from 'src/auth/strategies/access-token.strategy';

@Module({
  imports: [UserModule, AuthModule, MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), JwtModule.register({})],
  controllers: [PostController],
  providers: [PostService, AccessTokenStrategy]
})
export class PostModule {}
