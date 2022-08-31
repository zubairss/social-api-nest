import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class PaginateOptionsDto {

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    limit: number;

    @IsOptional()
    @Type(() => String)
    @IsIn(["asc", "desc"])
    sort: string;

}