import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { Conversation } from './modules/conversations/entities/conversation.entity';
import { Message } from './modules/conversations/entities/message.entity';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [User, Conversation, Message],
        synchronize: config.get<string>('NODE_ENV') === 'development',
        logging: config.get<string>('NODE_ENV') === 'development',
        ssl:
          config.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
    }),
    UsersModule,
    AuthModule,
    ConversationsModule,
  ],
})
export class AppModule {}
