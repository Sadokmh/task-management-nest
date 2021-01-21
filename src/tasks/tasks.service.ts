import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/auth/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}


    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto)
    }


    getTasksByUser(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasksByUser(filterDto, user)
    }
    
    
    

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with ID: ${id} not found !`);
        }

        return found;
    }

    async getTaskByIdAndUser(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id} });

        if (!found) {
            throw new NotFoundException(`Task with ID: ${id} not found !`);
        }

        return found;
    }


    createTask(createTaskDto: CreateTaskDto, user: User) {
        return this.taskRepository.createTask(createTaskDto, user);
    }


    async deleteTask(id: number, user: User): Promise<void> {
        //const found = await this.getTaskById(id);
       
        const result = await this.taskRepository.delete({id, userId: user.id});

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID: ${id} not found !`);
        }

        console.log(result);
        
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const taskToUpdate = await this.getTaskByIdAndUser(id, user);

        taskToUpdate.status = status;
        await taskToUpdate.save();
        
        return taskToUpdate;
    }

}
