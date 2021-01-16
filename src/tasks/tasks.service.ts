import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[]{
        const { status, search } = filterDto;
        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter((task: Task) => task.status === status);
        }

        if (search) {
            tasks = tasks.filter((task: Task) => 
                task.title.includes(search) || task.description.includes(search)
            );
        }
        
        return tasks;
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find((task: Task) => task.id === id);
        if (!found) {
           throw new NotFoundException(`Task with ID: ${id} not found !`);     
        }
        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const {title, description} = createTaskDto;

        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void {
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter((task: Task) => task.id !== id);
    }

    updateTaskStatus(id: string, status: TaskStatus) {
        const taskToUpdate = this.getTaskById(id);
        taskToUpdate.status = status;
        return taskToUpdate;
    }

}
