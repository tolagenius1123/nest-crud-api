import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
		}),
		MongooseModule.forRootAsync({
			useFactory: (config: ConfigService) => ({
				uri: config.getOrThrow<string>('MONGO_DB_URI'),
			}),
			inject: [ConfigService],
		}),
		CarsModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
