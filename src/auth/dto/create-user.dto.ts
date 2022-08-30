import { Optional } from "@nestjs/common";
import { IsEmail, Length, Min, Max, MinLength, IsString, IsNotEmpty, Allow, isEnum, IsNumber, IsOptional, IsIn, } from "class-validator";

export class CreateUserDto {


    @MinLength(3, { message: "Name lenght too short"})
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 15, { message: "Password lenght must be between 6 - 15"})
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