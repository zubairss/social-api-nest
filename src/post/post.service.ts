import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostService {

    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, private jwtService: JwtService) {}

    async createPost(createPostDto: CreatePostDto, authToken: string) {
        const user = this.jwtService.decode(authToken);
        const authorId = user['_id'];

        const post = { ...createPostDto, author: authorId }

        const createdPost = new this.postModel(post);
        try{
            await createdPost.save();
            return {
                post: createdPost,
                message: "Post Successfully Created!",
                statusCode: HttpStatus.CREATED
            }
        } catch(error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }



    }

    async postFeed(authToken: string){


    }


    // async registerUser(createUserDto: CreateUserDto): Promise<any> {   
    //     const createdUser = new this.userModel(createUserDto);  
    //     try{
    //         await createdUser.save();
    //         const payload = { _id: createdUser._id, name: createdUser.name, email: createdUser.email, gender: createdUser.gender, friends: createdUser.friends, friendRequests: createdUser.friendRequests };
    //         const access_token = this.jwtService.sign(payload);
    //         return {
    //             user: payload,
    //             accessToken: access_token,
    //             message: "User Successfully Created",
    //             statusCode: HttpStatus.CREATED
    //         }
    //     } catch(error){
    //         // throw new InternalServerErrorException(error.message);
    //         throw new HttpException(error.message, HttpStatus.CONFLICT);   
    //      }
    // }
}
