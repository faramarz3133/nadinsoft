import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsInt, Min } from 'class-validator';

export class GetUsersDto {
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
