import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, mongo, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User{
    @Prop({ type: String, required: true })
    name: String;

    @Prop({ type: String, required: true, unique: true })
    email: String;

    @Prop({ type: String, required: true })
    password: String;

    @Prop({ type: Number })
    age: Number;

    @Prop({ type: String, enum: ["male", "female"]})
    gender: String;

    @Prop({ type: String })
    country: String;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    friends: User[]

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    friendRequests: User[]



}

export const UserSchema = SchemaFactory.createForClass(User);
