import { IsEmail, Length, Min, Max, MinLength, IsString, IsNotEmpty, Allow, isEnum, IsNumber, IsOptional, IsIn, Validate, } from "class-validator";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import mongoose from "mongoose";

@ValidatorConstraint({ name: 'mongooseId', async: false })
export class IsMongooseId implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return mongoose.Types.ObjectId.isValid(text)
  }

  defaultMessage(args: ValidationArguments) {
    return 'Not a Valid Mongoose Object Id';
  }
}


export class QueryMongoIdDto{

    @Validate(IsMongooseId)
    @IsNotEmpty()
    id: string


}






