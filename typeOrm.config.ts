import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Product } from './src/products/entities/product.entity';
import { Transaction } from './src/transactions/entities/transaction.entity';
import { User } from './src/users/entities/user.entity';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow<string>('DB_HOST'),
  port: configService.getOrThrow<number>('DB_PORT'),
  username: configService.getOrThrow<string>('DB_USERNAME'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),
  database: configService.getOrThrow<string>('DB_NAME'),
  entities: [User, Product, Transaction],
  migrations: ['migrations/**'],
});
