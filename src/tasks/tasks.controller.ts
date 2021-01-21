import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { GetUser } from 'src/auth/auth/get-user.decorator';
import { User } from 'src/auth/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {  
    private logger = new Logger('TasksController');

    constructor(private tasksSerivce: TasksService) {

    }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksSerivce.getTasks(filterDto);
    }

    @Get('/user')
    getTasksByUser(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        //just a log
        this.logger.verbose(`User ${user.username} retrieving all tasks`);
        return this.tasksSerivce.getTasksByUser(filterDto, user);
    }


    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number ): Promise<Task> {
        return this.tasksSerivce.getTaskById(id);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        return this.tasksSerivce.createTask(createTaskDto, user); 
    }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.tasksSerivce.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User    
    ) : Promise<Task> {
        return this.tasksSerivce.updateTaskStatus(id, status, user);
    }
}
