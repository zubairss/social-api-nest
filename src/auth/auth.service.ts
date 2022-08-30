import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModule } from 'src/user/user.module';
import { User, UserDocument } from 'src/user/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async registerUser(createUserDto: CreateUserDto): Promise<User> {   
        const createdUser = new this.userModel(createUserDto);  
        try{
            console.log(createdUser);
            return await createdUser.save();
        } catch(error){
            // throw new InternalServerErrorException(error.message);
            throw new HttpException(error.message, HttpStatus.CONFLICT);   
         }

        
    }

}

