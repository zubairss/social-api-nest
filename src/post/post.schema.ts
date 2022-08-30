import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, mongo, Mongoose, ObjectId } from 'mongoose';
import { User } from 'src/user/user.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post{
    @Prop({ type: String, required: true }, )
    title: String;

    @Prop({ type: String, required: true })
    description: String

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    author: User

    

}

export const PostSchema = SchemaFactory.createForClass(Post);