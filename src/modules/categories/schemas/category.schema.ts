
import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type CatDocument = HydratedDocument<Category>

@Schema({ timestamps: true })
export class Category {
    @Prop()
    name: string;

    @Prop()
    image: string;

    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
    parentCategoryId: Types.ObjectId | null;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], default: [] })
    subCategories: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
