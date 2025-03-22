import { Injectable ,NotFoundException} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { UpdateTaskStatusDto } from './dto/update-task-status';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) {}

    async createTask(createtaskdto:CreateTaskDto,user:User): Promise<Task> {
        const {title,description} = createtaskdto;

        const task = this.tasksRepository.create({
            title,
            description,
            user,
        })

        await this.tasksRepository.save(task);

        return task;
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<{ tasks: Task[], total: number }> {
        const { search, page = 1, limit = 10 } = filterDto;
        const query = this.tasksRepository.createQueryBuilder('task');
    
        query.where({ user });
    
        if (search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` }
            );
        }
    
        const skip = (page - 1) * limit; 
        query.skip(skip).take(limit);
    
        const [tasks, total] = await query.getManyAndCount();
    
        return {
            tasks,
            total
        };
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.tasksRepository
            .createQueryBuilder('task')
            .where('task.id = :id', { id })
            .andWhere('task.userId = :userId', { userId: user.id })
            .getOne();
    
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    
        return found;
    }

    async deleteTaskById(id: string,user:User): Promise<void> {
        const task = await this.getTaskById(id,user);
        await this.tasksRepository.remove(task)
    }

    async updateTaskById(id:string,updateTaskStatusDto:UpdateTaskStatusDto,user:User): Promise<Task> {
        const{ title , description } = updateTaskStatusDto;
        const task = await this.getTaskById(id,user);
        
        if(title){
            task.title = title;
        }

        if(description){
            task.description = description;
        }

        try{
            await this.tasksRepository.save(task);
        } catch{
            throw new Error
        }
        
        return task;
    }
    
    async uploadfile(id:string,file,user:User): Promise<void> {
        const task = await this.getTaskById(id,user);
        task.attachment = file.filename;
        await this.tasksRepository.save(task);
    }
}
 