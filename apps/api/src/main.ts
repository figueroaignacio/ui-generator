import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TrpcRouter } from './modules/trpc/trpc.router';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const trpcRouter = app.get(TrpcRouter);
  const jwtService = app.get(JwtService);

  app.use(
    '/api/trpc',
    createExpressMiddleware({
      router: trpcRouter.appRouter,
      createContext: ({ req, res }) => {
        const token = req.cookies?.access_token;
        let user;
        if (token) {
          try {
            const payload = jwtService.verify(token);
            user = { id: payload.sub, username: payload.username };
          } catch {
            // Silently ignore invalid or expired tokens in MW context
          }
        }
        return { req, res, user };
      },
    }),
  );

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}

bootstrap();
