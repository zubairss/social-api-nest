import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection, connection } from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import process from 'process';


const configService = new ConfigService();


@Module({
  imports: [AuthModule, UserModule, PostModule, ConfigModule.forRoot( { expandVariables: true, isGlobal: true }),
    MongooseModule.forRoot(configService.get('MONGO_CONNECTION_URL'), 
    {
      connectionFactory: (connection: Connection) => {
        if(connection.readyState === 1) {
          Logger.log(`Connected to MongoDB - Database = ${connection.db.namespace}`);
        }
        connection.on('disconnected', () => {
          Logger.log('DB disconnected');
        });
        return connection;
      },
      retryAttempts: 100,
      useNewUrlParser: true,
      keepAlive: true,
    })
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
