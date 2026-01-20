import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryCarsDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	@Transform(({ value }) => Number(value))
	page?: number = 1;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Transform(({ value }) => Number(value))
	limit?: number = 10;

	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@IsInt()
	@Transform(({ value }) => Number(value))
	modelYear?: number;
}
