import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message:'password is too weak'})
    password: string;

    @IsEmail({},{message:'Invalid email address'})
    email:string;

    @Matches(/^\+?[0-9]\d{1,14}$/, { message: 'Invalid phone number format' })
    phone?: string;
}