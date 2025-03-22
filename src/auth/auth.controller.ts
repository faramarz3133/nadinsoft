import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignIn } from './dto/signin.dto';
import { User } from './user.entity';
import { AdminGuard } from './admin.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { GetUser } from './get-user.decorator';
import { GetUsersDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import path = require('path');
import {v4 as uuidv4} from 'uuid';
import { diskStorage } from 'multer';
import { Response } from 'express';

export const strorage = {
    storage: diskStorage({
        destination: './upload/profileimages',
        filename: (req,file,cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g,'')+ uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null,`${filename}${extension}`)
        }
    })
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    signUp(@Body() authCredentialsDto:AuthCredentialsDto ): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(@Body() si:SignIn ): Promise<{accessToken:string}> {
        return this.authService.signIn(si);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard(),AdminGuard)
        deleteTaskById(
            @Param('id') id:string
        ): Promise<void> {
            return this.authService.deleteUser(id);
        }

    @Get('/all')
    @UseGuards(AuthGuard(),AdminGuard)
    getAll(@Query() filterDto: GetUsersDto): Promise<{ users: User[], total: number }> {
        return this.authService.allUsers(filterDto);
    }

    @Get('/profile')
    @UseGuards(AuthGuard())
    getProfile(@GetUser() user:User){
        return user;
    }

    @Patch('/:id/changerole')
    @UseGuards(AuthGuard(),AdminGuard)
    updateUserRole(
        @Param('id') id:string,
        @Body() updateUserRoleDto:UpdateUserRoleDto,
    ): Promise<User> {
        const { role } = updateUserRoleDto
        return this.authService.updateRoleById(id,role);
    }
    
    @Patch('/:id/updateAdmin')
    @UseGuards(AuthGuard(),AdminGuard)
    updateUserAdmin(
        @Param('id') id:string,
        @Body() updateUserDto:UpdateUserDto
    ): Promise<User> {
        return this.authService.updateUserAdmin(id,updateUserDto);
    }

    @Post('/uploadimage')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('file',strorage))
    uploadFile(
        @UploadedFile() file,
        @GetUser() user:User,
    ): Promise<void>{
        if(!file){
            throw new BadRequestException('File is required');
        }
        return this.authService.uploadimage(file,user);
    }

    @Get('/download/:filename')
    @UseGuards(AuthGuard())
    async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = path.join(__dirname, '..', '..', 'upload/profileimages', filename);
        return res.download(filePath);
    }

    @Patch('/updateUser')
    @UseGuards(AuthGuard())
    updateUser(
        @Body() updateUserDto:UpdateUserDto,
        @GetUser() user:User,
    ): Promise<User> {
        return this.authService.updateUser(updateUserDto,user);
    }


}
