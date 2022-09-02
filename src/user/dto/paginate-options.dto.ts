import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { SortOptions } from "enum/sort-options.enum";

export class PaginateOptionsDto {

    @ApiProperty({ description: "Page Number", example: "1"})
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page: number;

    @ApiProperty({ description: "Limit per Page", example: "10"})
    @IsOptional()
    @Type(() => Number) 
    @IsNumber()
    @Min(0)
    limit: number;

    @ApiProperty({ description: "Sort - asc or desc", example: "asc"})
    @IsOptional()
    @Type(() => String)
    @IsEnum(SortOptions, { message: `Value must be in enum: ${SortOptions.asc} or ${SortOptions.desc}`})
    sort: string;

}