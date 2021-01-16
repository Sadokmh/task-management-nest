import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    
    

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with ID: ${id} not found !`);
        }

        return found;
    }

    // getTaskById(id: string): Task {
    //     const found = this.tasks.find((task: Task) => task.id === id);
    //     if (!found) {
    //        throw new NotFoundException(`Task with ID: ${id} not found !`);     
    //     }
    //     return found;
    // }


    createTask(createTaskDto: CreateTaskDto) {
        return this.taskRepository.createTask(createTaskDto);
    }


    async deleteTask(id: number): Promise<void> {
        //const found = await this.getTaskById(id);
       
        const result = await this.taskRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID: ${id} not found !`);
        }

        console.log(result);
        
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const taskToUpdate = await this.getTaskById(id);

        taskToUpdate.status = status;
        await taskToUpdate.save();
        
        return taskToUpdate;
    }

}
