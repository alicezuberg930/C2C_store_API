
import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Variation } from "./variation.schema";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop()
    title: string

    @Prop()
    description: string

    @Prop()
    price: number

    @Prop()
    stock: number

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
    category: MongooseSchema.Types.ObjectId

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand' })
    brand: MongooseSchema.Types.ObjectId

    @Prop()
    images: string[]

    @Prop()
    weight: number

    @Prop()
    length: number

    @Prop()
    width: number

    @Prop()
    height: number

    @Prop({ type: [Variation] })
    variations: Variation[]
}

export const ProductSchema = SchemaFactory.createForClass(Product);