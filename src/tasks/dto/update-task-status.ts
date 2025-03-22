import { IsOptional, IsString } from "class-validator";

export class UpdateTaskStatusDto{
    @IsOptional()
    @IsString()
    title? : string;

    @IsOptional()
    @IsString()
    description? : string;
}