import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FilterTasksDTO } from './dto/tasks.filter.dto';
import { CreateTaskDTO } from './dto/tasks.create.dto';
import { TaskRepository } from './tasks.repository';
import { User } from 'src/auth/users.entity';
import { Task } from './tasks.entity';
import { TaskStatus } from './tasks.status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterTasksDTO: FilterTasksDTO, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterTasksDTO, user);
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!found) {
      throw new NotFoundException(`The task with id ${id} not found`);
    }

    return found;
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const taskFound = await this.getTaskById(id, user);

    taskFound.status = status;

    await taskFound.save();

    return taskFound;
  }

  async deleteTaskById(id: number, user: User): Promise<Task> {
    const found = this.getTaskById(id, user);

    await this.taskRepository.delete(id);

    return found;
  }
}
