import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';

@Module({
  imports: [
    // TODO: use env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 2345,
      username: 'postgres',
      database: 'postgres',
      password: 'mypassword',
      autoLoadEntities: true,
      dropSchema: true,
      synchronize: true,
      logging: ['error'],
      keepConnectionAlive: process.env.NODE_ENV === 'test' ? true : false,
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  async onModuleInit() {
    if (getConnection().isConnected) {
      Logger.log(`Database connection is ${getConnection().isConnected}`, 'DatabaseModule');
      return getConnection();
    }
  }
}
