import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

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
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
