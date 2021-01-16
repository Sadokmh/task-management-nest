import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    constructor(private tasksSerivce: TasksService) {

    }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
        if (Object.keys(filterDto).length) {
            return this.tasksSerivce.getTasksWithFilters(filterDto);
        }
        else {
            return this.tasksSerivce.getAllTasks();
        }
        
    }


    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksSerivce.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksSerivce.createTask(createTaskDto); 
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): void {
        this.tasksSerivce.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) status: TaskStatus) : Task {
        return this.tasksSerivce.updateTaskStatus(id, status);
    }
}
