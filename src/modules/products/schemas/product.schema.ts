
import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Variation } from "./variation.schema";

export type CatDocument = HydratedDocument<Product>;

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

    @Prop()
    categoryId: string

    @Prop()
    brandId: string

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