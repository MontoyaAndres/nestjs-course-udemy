import { EntityRepository, Repository } from 'typeorm';

import { FilterTasksDTO } from './dto/tasks.filter.dto';
import { CreateTaskDTO } from './dto/tasks.create.dto';
import { TaskStatus } from './tasks.status.enum';
import { Task } from './tasks.entity';
import { User } from 'src/auth/users.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterTasksDTO: FilterTasksDTO, user: User): Promise<Task[]> {
    const { status, searchTerm } = filterTasksDTO;

    try {
      const query = this.createQueryBuilder('task');

      query.where('task.userId = :userId', { userId: user.id });

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      if (searchTerm) {
        query.andWhere(
          '(task.title LIKE :searchTerm OR task.description LIKE :searchTerm)',
          { searchTerm: `%${searchTerm}%` },
        );
      }

      const tasks = await query.getMany();

      return tasks;
    } catch (error) {
      console.error(error);

      throw new Error(error);
    }
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;

    const newTask = new Task();
    newTask.title = title;
    newTask.description = description;
    newTask.status = TaskStatus.OPEN;
    newTask.user = user;
    newTask.userId = user.id;

    try {
      await newTask.save();

      delete newTask.user;

      return newTask;
    } catch (error) {
      console.error(error);

      throw new Error(error);
    }
  }
}
