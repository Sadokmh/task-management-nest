import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    constructor(private tasksSerivce: TasksService) {

    }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
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
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksSerivce.createTask(createTaskDto); 
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): void {
        this.tasksSerivce.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus) : Task {
        return this.tasksSerivce.updateTaskStatus(id, status);
    }
}