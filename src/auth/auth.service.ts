import { HttpCode, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModule } from 'src/user/user.module';
import { User, UserDocument } from 'src/user/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtService: JwtService) {}

    async registerUser(createUserDto: CreateUserDto): Promise<any> {   
        const createdUser = new this.userModel(createUserDto);  
        try{
            await createdUser.save();
            const payload = { _id: createdUser._id, name: createdUser.name, email: createdUser.email, gender: createdUser.gender, friends: createdUser.friends, friendRequests: createdUser.friendRequests };
            const access_token = this.jwtService.sign(payload);
            return {
                user: payload,
                accessToken: access_token,
                message: "User Successfully Created",
                statusCode: HttpStatus.CREATED
            }
        } catch(error){
            // throw new InternalServerErrorException(error.message);
            throw new HttpException(error.message, HttpStatus.CONFLICT);   
         }
    }

    async loginUser(loginUserDto: LoginUserDto): Promise<any>{

        return await this.userModel.findOne({ email: loginUserDto.email }).lean().then(async (res) => {
            if (res){
                const isMatch = await bcrypt.compare(loginUserDto.password, res.password.toString());
                if(isMatch) {
                    const payload = { _id: res._id, name: res.name, email: res.email, gender: res.gender, friends: res.friends, friendRequests: res.friendRequests }
                    const access_token = this.jwtService.sign(payload);
                    return {
                        user: payload,
                        accessToken: access_token,
                        message: "Login Successful",
                        statusCode: HttpStatus.OK
                    };
                }
                throw new HttpException("Incorrect Password", HttpStatus.UNAUTHORIZED)
            }
            throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
        })

        
    }


}

