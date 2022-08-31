import { IsEmail, Length, Min, Max, MinLength, IsString, IsNotEmpty, Allow, isEnum, IsNumber, IsOptional, IsIn, } from "class-validator";

export class CreateUserDto {

    @MinLength(3, { message: "Name length too short"})
    @IsString()
    @IsOptional()
    name: string;

    @IsEmail()
    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    @Length(6, 15, { message: "Password length must be between 6 - 15"})
    password: string;

    @IsOptional()
    @IsString()
    @IsIn(["male", "female"])
    gender: string;

    @IsOptional()
    @IsNumber()
    age: number;

    @IsOptional()
    @IsString()
    country: string;


}