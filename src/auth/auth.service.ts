import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModule } from 'src/user/user.module';
import { User, UserDocument } from 'src/user/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async registerUser(createUserDto: CreateUserDto): Promise<User> {   
        const createdUser = new this.userModel(createUserDto);  
        try{
            return await createdUser.save();
        } catch(error){
            // throw new InternalServerErrorException(error.message);
            throw new HttpException(error.message, HttpStatus.CONFLICT);   
         }
    }

    async loginUser(loginUserDto: LoginUserDto): Promise<User>{

        return await this.userModel.findOne({ email: loginUserDto.email }).lean().then(async (res) => {
            if (res){
                const isMatch = await bcrypt.compare(loginUserDto.password, res.password.toString());
                if(isMatch) {
                    return res;
                }
                throw new HttpException("Incorrect Password", HttpStatus.UNAUTHORIZED)
            }

            throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
        })


    }

}

