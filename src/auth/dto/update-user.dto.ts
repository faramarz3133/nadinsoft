import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message:'password is too weak'})
    password: string;

    @IsOptional()
    @IsEmail({},{message:'Invalid email address'})
    email:string;

    @IsOptional()
    @Matches(/^\+?[0-9]\d{1,14}$/, { message: 'Invalid phone number format' })
    phone: string;
}