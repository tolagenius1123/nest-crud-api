import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCarDto {
	@IsString()
	@IsNotEmpty({ message: 'Model title is a required field' })
	readonly modelTitle: string;

	@IsInt({ message: 'Model year must be a number' })
	@IsNotEmpty({ message: 'Model year is a required field' })
	@Min(2000, { message: 'Model year cannot be less than year 2000' })
	readonly modelYear: number;
}
