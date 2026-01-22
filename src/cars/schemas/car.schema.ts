import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
	timestamps: true,
})
export class Car {
	@Prop({
		required: true,
		trim: true,
	})
	modelTitle: string;

	@Prop({
		required: true,
	})
	modelYear: number;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	})
	user: mongoose.Types.ObjectId;
}

export const CarSchema = SchemaFactory.createForClass(Car);
CarSchema.index({ modelTitle: 1, modelYear: 1 }, { unique: true });
