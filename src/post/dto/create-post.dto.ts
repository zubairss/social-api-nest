import { Length, IsString, IsNotEmpty, Validate, } from "class-validator";



// import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
// import mongoose from "mongoose";

// @ValidatorConstraint({ name: 'mongooseId', async: false })
// export class IsMongooseId implements ValidatorConstraintInterface {
//   validate(text: string, args: ValidationArguments) {
//     return mongoose.Types.ObjectId.isValid(text)
//   }

//   defaultMessage(args: ValidationArguments) {
//     return 'Not a Valid Mongoose Object Id';
//   }
// }



export class CreatePostDto{

    @IsString()
    @IsNotEmpty()
    @Length(12, 100)
    title: string

    @IsString()
    @IsNotEmpty()
    @Length(20, 500)
    description: string

    // @Validate(IsMongooseId)
    // @IsNotEmpty()
    // author: string
}