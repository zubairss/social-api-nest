import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AccessTokenStrategy } from 'src/auth/strategies/access-token.strategy';

const saltOrRounds: number = 10;

@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: User.name , useFactory: () =>{

    const schema = UserSchema;
    schema.pre('save', async function () {

      console.log("Pre MD");
      const hash =  await bcrypt.hash(this.password.toString(), saltOrRounds);
      this.password = hash;
    });

    schema.pre('findOneAndUpdate', async function() {
      const userToUpdate = await this.model.findOne(this.getQuery());
      
      if('password' in this.getUpdate()) {
        this.getUpdate()['password']  = await bcrypt.hash(this.getUpdate()['password'].toString(), saltOrRounds);
      }


      // if(this.getUpdate().includes('password')) {
        
      // }

    })

    return schema;

  } }]), JwtModule.register({
    secret: "CitrusBits",
    signOptions: {expiresIn: '1000000s'}
  })],
  controllers: [UserController],
  providers: [UserService, AccessTokenStrategy],
  exports: [MongooseModule]
})
export class UserModule {}
