import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function swaggerSetup(app) {
  const config = new DocumentBuilder()
    .setTitle('User Microservice API')
    .setDescription('API para la gestión de usuarios de ColiApp')
    .setVersion('1.0')
    .addTag('users', 'Endpoins relacionados con la gestión de usuarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true, 
    })
  );
  await swaggerSetup(app);
  await app.listen(process.env.PORT ?? 3500);
}
bootstrap();
