import { BadRequestException, PipeTransform } from '@nestjs/common';

import { TaskStatus } from '../tasks.status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly AllowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ] as const;

  transform(value: TaskStatus) {
    value = value.toUpperCase() as TaskStatus;

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`The status ${value} is not already`);
    }

    return value;
  }

  private isStatusValid(status: TaskStatus) {
    const idx = this.AllowedStatus.indexOf(status);

    return idx !== -1;
  }
}
