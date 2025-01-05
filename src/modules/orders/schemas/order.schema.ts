import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CatDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop()
    amount: number

    @Prop()
    paymentMethod: string

    
}

export const OrderSchema = SchemaFactory.createForClass(Order);