import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name ,schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule]
})
export class UserModule {}
