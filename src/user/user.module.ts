import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

const saltOrRounds: number = 10;

@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: User.name , useFactory: () =>{

    const schema = UserSchema;
    schema.pre('save', async function () {

      console.log("Pre MD");
      const hash =  await bcrypt.hash(this.password.toString(), saltOrRounds);
      this.password = hash;
    })

    return schema;

  } }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule]
})
export class UserModule {}
