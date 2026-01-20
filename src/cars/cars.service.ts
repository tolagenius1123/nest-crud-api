import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car } from './schemas/car.schema';
import { Model } from 'mongoose';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { MongoServerError } from 'mongodb';
import { QueryCarsDto } from './dto/query-cars.dto';

@Injectable()
export class CarsService {
	constructor(@InjectModel(Car.name) private readonly carModel: Model<Car>) {}

	async findAll(query: QueryCarsDto): Promise<{
		data: Car[];
		total: number;
		page: number;
		limit: number;
	}> {
		const { page = 1, limit = 10, search, modelYear } = query;
		const filter: Record<string, any> = {};

		if (search) {
			filter.modelTitle = {
				$regex: search,
				$options: 'i',
			};
		}

		if (modelYear) {
			filter.modelYear = modelYear;
		}

		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			this.carModel.find(filter).skip(skip).limit(limit).lean().exec(),

			this.carModel.countDocuments(filter),
		]);

		return { data, total, page, limit };
	}

	async create(createCarDto: CreateCarDto): Promise<Car> {
		const { modelYear, modelTitle } = createCarDto;
		try {
			return await this.carModel.create(createCarDto);
		} catch (error: unknown) {
			if (error instanceof MongoServerError && error.code === 11000) {
				throw new BadRequestException(
					`A ${modelYear} ${modelTitle} already exists`,
				);
			}
			throw new BadRequestException('Unable to create car');
		}
	}

	// async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
	// 	const updatedCar = await this.carModel
	// 		.findByIdAndUpdate(id, updateCarDto, {
	// 			new: true,
	// 			runValidators: true,
	// 			lean: true,
	// 		})
	// 		.exec();
	//
	// 	if (!updatedCar)
	// 		throw new NotFoundException(`Car with id ${id} not found`);
	//
	// 	return updatedCar;
	// }

	async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
		try {
			const updatedCar = await this.carModel
				.findByIdAndUpdate(id, updateCarDto, {
					new: true,
					runValidators: true,
					lean: true,
				})
				.exec();

			if (!updatedCar) {
				throw new NotFoundException(`Car with id ${id} not found`);
			}

			return updatedCar;
		} catch (error: unknown) {
			if (error instanceof MongoServerError && error.code === 11000) {
				const { modelYear, modelTitle } = updateCarDto;

				throw new BadRequestException(
					`A ${modelYear} ${modelTitle} already exists`,
				);
			}

			throw new BadRequestException('Unable to update car');
		}
	}

	async find(id: string): Promise<Car> {
		const existingCar = await this.carModel.findById(id).lean().exec();

		if (!existingCar)
			throw new NotFoundException(`Car with id ${id} not found`);

		return existingCar;
	}

	async delete(id: string): Promise<void> {
		const deleted = await this.carModel.findByIdAndDelete(id).exec();

		if (!deleted)
			throw new NotFoundException(`Car with id ${id} not found`);
	}
}
