import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import path = require('path');
import {v4 as uuidv4} from 'uuid';
import { diskStorage } from 'multer';
import { Response } from 'express';

export const strorage2 = {
    storage: diskStorage({
        destination: './upload/taskfiles',
        filename: (req,file,cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g,'')+ uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null,`${filename}${extension}`)
        }
    })
}

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get('/:id')
    getTaskById(
        @Param('id') id: string,
        @GetUser() user:User,
    ): Promise<Task> {
        return this.tasksService.getTaskById(id,user)
    }

    @Post()
    createTask(
        @Body() createtaskdto:CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.createTask(createtaskdto,user);
    }

    @Get()
    getTasks(
        @Query() filterDto:GetTasksFilterDto,
        @GetUser() user:User,
    ): Promise<{tasks:Task[],total:number}> {
        return this.tasksService.getTasks(filterDto,user);        
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id') id:string,
        @GetUser() user:User,
    ): Promise<void> {
        return this.tasksService.deleteTaskById(id,user);
    }

    @Patch('/:id/taskfile')
    @UseInterceptors(FileInterceptor('file',strorage2))
    uploadFile(
        @Param('id') id:string,
        @UploadedFile() file,
        @GetUser() user:User,
    ): Promise<void>{
        return this.tasksService.uploadfile(id,file,user);
    }

    @Get('/download/:filename')
    @UseGuards(AuthGuard())
    async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = path.join(__dirname, '..', '..', 'upload/taskfiles', filename);
        return res.download(filePath);
    }
    
    @Patch('/:id/update')
    updateTaskById(
        @Param('id') id:string,
        @Body() updateTaskStatusDto:UpdateTaskStatusDto,
        @GetUser() user:User,
    ): Promise<Task> {
        return this.tasksService.updateTaskById(id,updateTaskStatusDto,user);
    }

}
