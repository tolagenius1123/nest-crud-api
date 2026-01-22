import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema } from './schemas/car.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Car', schema: CarSchema }]),
		AuthModule,
	],
	providers: [CarsService],
	controllers: [CarsController],
})
export class CarsModule {}
