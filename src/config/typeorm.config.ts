require('dotenv').config();

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.TYPE as 'mysql',
  host: process.env.HOST,
  port: parseInt(process.env.PORT, 10) as number,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: false,
};
