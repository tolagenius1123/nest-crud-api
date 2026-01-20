import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const CarSchema = SchemaFactory.createForClass(Car);
CarSchema.index({ modelTitle: 1, modelYear: 1 }, { unique: true });
