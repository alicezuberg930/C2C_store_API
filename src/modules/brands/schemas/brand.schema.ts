import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Schema as MongooseSchema } from "mongoose"

export type BrandDocument = HydratedDocument<Brand>

@Schema({ timestamps: true })
export class Brand {
    @Prop()
    name: string;

    @Prop()
    image: string;

    @Prop()
    description: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }] })
    categories: MongooseSchema.Types.ObjectId[]
}

export const BrandSchema = SchemaFactory.createForClass(Brand)