import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const port = configService.get('PORT')

  const config = new DocumentBuilder()
    .setTitle('Social API')
    .setDescription('Functioanalities - Users, Posts, Auth, CRUD')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(port);
  console.log(`Listening on ${port}`)
}
bootstrap();
