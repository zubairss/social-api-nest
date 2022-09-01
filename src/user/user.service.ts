import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, mongo, Mongoose } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModule } from './user.module';
import { User, UserDocument } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import { QueryMongoIdDto } from './dto/query-id.dto';
import { PaginateOptionsDto } from './dto/paginate-options.dto';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtService: JwtService) {}

    findAll(options) {
        return this.userModel.find(options);
    }

    count(options){
        return this.userModel.count(options).exec(); 
    }

    async findandUpdate(userDetails: UpdateUserDto, authToken: string): Promise<any>{

        const userId: string = this.jwtService.decode(authToken)['_id'];
        return await this.userModel.findByIdAndUpdate(userId, userDetails, { new: true }).then((res) => {
            if (res) return { res, message: "User Updated Successfully" };
            throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
        }).catch((err) => {
            throw new HttpException(err.message, HttpStatus.CONFLICT);
        })
    }

    async friendListing(query: PaginateOptionsDto ,authToken: string): Promise<any>{
        const userId = this.jwtService.decode(authToken)['_id'];

        const page: number = parseInt(query.page as any) || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const sort = query.sort == "desc"?-1:1;

        console.log(userId);

        return await this.userModel.aggregate(
            [
                {
                    $match: { _id: new mongoose.Types.ObjectId(userId)}
                },
                {
                    '$project': {
                      'friends': 1, 
                      '_id': 0
                    }
                  }, {
                    '$lookup': {
                      'from': 'users', 
                      'localField': 'friends', 
                      'foreignField': '_id', 
                      'as': 'friends'
                    }
                  }, 
                  {
                    '$unwind': {
                      'path': '$friends'
                    }
                  },
                  {
                    $sort: {'friends.createdAt': sort}
                  },
                  {
                    $skip: skip
                  },
                  {
                    $limit: limit
                  },
                  {$setWindowFields: {output: {totalCount: {$count: {}}}}}

             ]
        )
        .then((res) => {
            if (res) return res;
            throw new HttpException("No Friends Found", HttpStatus.NO_CONTENT);
           }).catch((err) => { throw new HttpException(err.message, HttpStatus.BAD_REQUEST)})

    }


    async sendFriendRequest(query: QueryMongoIdDto, authToken: string): Promise<any>{
      
        const friendId = query.id;
        const user = this.jwtService.decode(authToken);
        const userId: string = user['_id'];
        const friendsList = user['friendRequests']

        if (friendId == userId) throw new HttpException("Can't Send Request to Yourself", HttpStatus.BAD_REQUEST);
    
        await this.userModel.findById(friendId).then((res) => {
            if (res) {
                if(res['friendRequests'].includes(userId as any)){
                    throw new HttpException("Friend Request Already Sent", HttpStatus.CONFLICT);
                }
                return;
            }
            throw new HttpException("User Not Found - Friend", HttpStatus.NOT_FOUND);
        }).catch((err) => { throw new HttpException(err.message, HttpStatus.AMBIGUOUS) })


        return await this.userModel.findByIdAndUpdate(friendId, { $push: { friendRequests: userId }}).then((res) => {
            if (res) return { message: "Friend Request Sent!"}
            throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
        }).catch((err) => {
            throw new HttpException(err.message, HttpStatus.CONFLICT);
        })

    }

    async deleteFriendRequest(query: QueryMongoIdDto, authToken: string): Promise<any>{
        const user = this.jwtService.decode(authToken);
        const userId = user['_id'];
        const friendId = query.id;
        
        if(userId == friendId) throw new HttpException("Own ID & Friend ID Conflict", HttpStatus.CONFLICT);

        return await this.userModel.findByIdAndUpdate(userId, { $pull: { friendRequests: friendId }}).then((res) => {
            if (!res.friendRequests.includes(friendId as any)) throw new HttpException("Friend Request Don't Exists", HttpStatus.NOT_FOUND);
            if (res) return { message: "Friend Request Deleted!"}
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND)
        }).catch((err) => {
            console.log("Catch Block");
            throw new HttpException(err.message, HttpStatus.CONFLICT);
        })


    }

    async acceptFriendRequest(query: QueryMongoIdDto, authToken: string): Promise<any>{
        const user = this.jwtService.decode(authToken);
        const userId = user['_id'];
        const friendId = query.id;

        if(userId == friendId) throw new HttpException("Own ID & Friend ID Conflict", HttpStatus.CONFLICT);

        return await this.userModel.findById(userId).then(async (res) => {
            if (res){
                if(res.friends.includes(friendId as any)) throw new HttpException("Already Friends", HttpStatus.CONFLICT);
                if(res.friendRequests.includes(friendId as any)) {
                    return await this.userModel.findByIdAndUpdate(userId, { $pull: { friendRequests: friendId }, $push: { friends: friendId }})
                    .then(async (res) => {
                        if(res) return await this.userModel.findByIdAndUpdate(friendId, { $push: { friends: userId }}).then((res) => {
                            if (res) return { message: "Friend Request Accepted"}
                            throw new HttpException("Friend Request Doesn't Exists", HttpStatus.CONFLICT)
                        }).catch((err) => { throw new HttpException(err.message, HttpStatus.CONFLICT )})
                        throw new HttpException("Friend Request Doesn't Exists", HttpStatus.CONFLICT);
                    }).catch((err) => { throw new HttpException(err.message, HttpStatus.CONFLICT)});
                }
            }
            throw new HttpException("Friend Request Not Found", HttpStatus.NOT_FOUND);
        }).catch((err) => {
            throw new HttpException(err.message, HttpStatus.CONFLICT);
        })

    }


    async removeFriend(query: QueryMongoIdDto, authToken: string): Promise<any>{
        const user = this.jwtService.decode(authToken);
        const userId = user['_id'];
        const friendId = query.id;

        if(userId == friendId) throw new HttpException("Own ID & Friend ID Conflict", HttpStatus.CONFLICT);

        return await this.userModel.findByIdAndUpdate(userId, { $pull: { friends: friendId }}).then(async (res) => {
            if (!res.friends.includes(friendId as any)) throw new HttpException("Friend Don't Exists", HttpStatus.NOT_FOUND);
            if (res) return await this.userModel.findByIdAndUpdate(friendId, { $pull: { friends: userId }}).then((res) => {
                if (res) return { message: "Friend Deleted!" }
                throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
            })
            // if (res) return { message: "Friend Deleted!"}
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND)
        }).catch((err) => {
            console.log("Catch Block");
            throw new HttpException(err.message, HttpStatus.CONFLICT);
        })

    }

}
