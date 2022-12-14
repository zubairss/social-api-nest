import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PaginateOptionsDto } from 'src/user/dto/paginate-options.dto';
import { User, UserDocument } from 'src/user/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostService {

    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, private jwtService: JwtService, @InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async createPost(createPostDto: CreatePostDto, authorId: string): Promise<any> {
     
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

    async postFeed(query:PaginateOptionsDto ,userId: string): Promise<any>{

        const page: number = parseInt(query.page as any) || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const sort = query.sort == "desc"?-1:1;


        const publicPosts = await this.postModel.find({ 'isPublic': true }).then((res) => {
            // res.push({ totalPublicPosts: res.length})
            return res;
        });


        const privateFriendPosts = await this.userModel.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(userId)
              }
            }, 
            {
                '$lookup': {
                    'from': 'posts', 
                    'localField': 'friends', 
                    'foreignField': 'author', 
                    'as': 'posts'
                }
            }, {
                '$project': {
                    'posts': 1, 
                    '_id': 0
                }
            }, 
            {
                '$unwind': {
                    'path': '$posts'
                }
            },
            {
                $match: {
                    "posts.isPublic": false
                }
            },
            // {
            //     $sort: {'posts.createdAt': sort}
            //   },
            //   {
            //     $skip: skip
            //   },
            //   {
            //     $limit: limit
            //   },
            //   {$setWindowFields: {output: {totalCount: {$count: {}}}}}
            
          ])
          .then(async (res) => {
            if(res) {
                // res.push({ totalPrivateFriendsPostsLenght: res.length})

                //Getting Pulbic Posts & Friend's Private Posts and Combining 
                const privatePosts = res.map((post) => post.posts)
                const publicPosts = await this.postModel.find({ 'isPublic': true });
                const allPosts = privatePosts.concat(publicPosts);

                console.log(allPosts);

                //Paginate

                allPosts.push({ 
                    totalPrivateFriendsPosts: privatePosts.length,
                    totalPublicPosts: publicPosts.length
                });
        
                return allPosts;
            }
            throw new HttpException("No Posts Found", HttpStatus.NO_CONTENT);
           }).catch((err) => { throw new HttpException(err.message, HttpStatus.BAD_REQUEST)});


        //    console.log(privateFriendPosts);
        //    console.log(publicPosts);

           return privateFriendPosts;
    }

}
