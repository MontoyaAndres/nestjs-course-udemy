import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [TasksModule, AuthModule, TypeOrmModule.forRoot(TypeOrmConfig)],
})
export class AppModule {}
