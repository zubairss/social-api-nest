import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection, connection } from 'mongoose';


@Module({
  imports: [AuthModule, UserModule, PostModule, 
    MongooseModule.forRoot('mongodb+srv://zubairshahid:ZShahid123@cluster0.5hldv5z.mongodb.net/social-api-nest?retryWrites=true&w=majority', 
    {
      connectionFactory: (connection: Connection) => {
        if(connection.readyState === 1) {
          Logger.log(`Connected to MongoDB - Database = ${connection.db.namespace}`);
        }
        connection.on('disconnected', () => {
          Logger.log('DB disconnected');
        });
        return connection;
      }
    })
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
