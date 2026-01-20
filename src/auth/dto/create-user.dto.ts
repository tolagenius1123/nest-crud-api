import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	readonly name: string;

	@IsEmail()
	@IsNotEmpty()
	readonly email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6, { message: 'Password cannot be less than 6 characters' })
	readonly password: string;
}
