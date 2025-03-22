import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

export class GetTasksFilterDto {

    @IsOptional()
    @IsString()
    search? : string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1) 
    limit?: number;
}
