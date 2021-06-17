import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

import { TaskStatus } from '../tasks.status.enum';

export class FilterTasksDTO {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  searchTerm: string;
}
