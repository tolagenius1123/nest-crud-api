import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
		private readonly jwtService: JwtService,
	) {}

	async register(createUserDto: CreateUserDto) {
		const { name, email, password } = createUserDto;

		const existingUser = await this.userModel.findOne({ email });

		if (existingUser) {
			throw new ConflictException('User already exist');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await this.userModel.create({
			name,
			email,
			password: hashedPassword,
		});

		const token = this.jwtService.sign({ id: user?._id });

		return {
			message: 'User registered successfully',
			accessToken: token,
		};
	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;

		const user = await this.userModel.findOne({ email });

		if (!user) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const token = this.jwtService.sign({ id: user?._id });

		return {
			message: 'User logged in successfully',
			accessToken: token,
		};
	}
}
