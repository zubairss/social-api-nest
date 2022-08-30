import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModule } from './user.module';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async createUser(): Promise<any> {

        return "DS";
    }

}
