import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeormConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'newpassword',
    database: 'tasks',
    entities: [__dirname + '/../**/*.entity.js'], 
    synchronize: true
}