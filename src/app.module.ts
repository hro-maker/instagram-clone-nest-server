import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv'
import * as path from 'path'
import { ServeStaticModule } from '@nestjs/serve-static';
import { PostModule } from './post/post.module';
import { ComentModule } from './coment/coment.module';
import { MessageModule } from './message/message.module';
import { EventsModule } from './socket/events.module';
dotenv.config()
@Module({
    imports: [
        ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, 'static')}),
          MongooseModule.forRoot(
            `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.3l6j1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
              useFindAndModify:false,
            }
          ),
          AuthModule,
          PostModule,
          ComentModule,
          MessageModule,
             EventsModule
        ]
})
export class AppModule {}
