import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RolesGuard } from './gaurds/roles.guard';
import { Reflector } from '@nestjs/core';





async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new RolesGuard(new Reflector()));


  // Middleware
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Complaints API')
    .setDescription('API for managing complaints')
    .setVersion('1.0')

    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // This name will be used in @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI at /api

  // Start server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser'

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.use(cookieParser());
//   app.enableCors(
//     ({
//       origin: 'http://localhost:3001',
//       credentials:true
//     })
//     )
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();
