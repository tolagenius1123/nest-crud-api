import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { CarsService } from './cars.service';
import { Car } from './schemas/car.schema';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { UpdateCarDto } from './dto/update-car.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectid.pipe';
import { QueryCarsDto } from './dto/query-cars.dto';

@Controller('cars')
export class CarsController {
	constructor(private readonly carService: CarsService) {}

	@Get()
	async getCars(@Query() query: QueryCarsDto) {
		return await this.carService.findAll(query);
	}

	@Post()
	async createCar(
		@Body() createCarDto: CreateCarDto,
	): Promise<ApiResponse<Car>> {
		const newCar = await this.carService.create(createCarDto);
		return {
			message: 'Car created successfully',
			data: newCar,
		};
	}

	@Put(':id')
	async updateCar(
		@Param('id', ParseObjectIdPipe) id: string,
		@Body()
		updateCarDto: UpdateCarDto,
	): Promise<ApiResponse<Car>> {
		const updatedCar = await this.carService.update(id, updateCarDto);

		return {
			message: 'Car updated successfully',
			data: updatedCar,
		};
	}

	@Get(':id')
	async getCarById(
		@Param('id', ParseObjectIdPipe) id: string,
	): Promise<ApiResponse<Car>> {
		const existingCar = await this.carService.find(id);

		return {
			message: 'Car retrieved successfully',
			data: existingCar,
		};
	}

	@Delete(':id')
	async deleteCar(
		@Param('id', ParseObjectIdPipe) id: string,
	): Promise<ApiResponse<void>> {
		await this.carService.delete(id);
		return {
			message: `Car deleted successfully`,
		};
	}
}
