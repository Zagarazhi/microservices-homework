import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ProfileModule } from './profile.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(ProfileModule);
	app.useGlobalPipes(new ValidationPipe());
	const configService = app.get(ConfigService);
	await app.listen(configService.get("PROFILE_PORT"));
}
bootstrap();
