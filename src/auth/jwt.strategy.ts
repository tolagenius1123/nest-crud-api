import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
	id: string;
	email: string;
	iat?: number;
	exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
		private configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
		});
	}

	async validate(payload: JwtPayload) {
		const { id } = payload;
		const user = await this.userModel.findById(id);

		if (!user) {
			throw new UnauthorizedException('Login to access this resource');
		}
		return user;
	}
}
