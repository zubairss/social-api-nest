import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Length, Min, Max, MinLength, IsString, IsNotEmpty, Allow, isEnum, IsNumber, IsOptional, IsIn, IsEnum, } from "class-validator";
import { GenderOptions } from "enum/gender.enum";

export class CreateUserDto {

    @ApiProperty({ description: "User's Name", example: "Zubair Shahid"})
    @MinLength(3, { message: "Name length too short"})
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({ description: "User's Email", example: "zubair81@gmail.com"})
    @IsEmail()
    @IsString()
    @IsOptional()
    email: string;

    @ApiProperty({ description: "User's Password", example: "pass123"})
    @IsString()
    @IsOptional()
    @Length(6, 15, { message: "Password length must be between 6 - 15"})
    password: string;

    @ApiProperty({ description: "User's Gender - Male / Female", example: "male"})
    @IsOptional()
    @IsString()
    // @IsIn(["male", "female"])
    @IsEnum(GenderOptions, { message: `Value must be in enum: ${GenderOptions.male} or ${GenderOptions.female}` })
    gender: string;

    @ApiProperty({ description: "User's Age", example: "23"})
    @IsOptional()
    @IsNumber()
    age: number;

    @ApiProperty({ description: "User's Country", example: "Pakistan "})
    @IsOptional()
    @IsString()
    country: string;


}