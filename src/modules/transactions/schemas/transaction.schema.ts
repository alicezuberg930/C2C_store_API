import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"
import { paymentMethods, transactionStatuses, transactionTypes } from "../enum"

export type TransactionDocument = HydratedDocument<Transaction>

@Schema({ timestamps: true })
export class Transaction {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ enum: transactionTypes })
    type: string;

    @Prop()
    amount: number;

    @Prop({ default: Date.now })
    date: Date;

    @Prop({ enum: transactionStatuses })
    status: string;

    @Prop()
    description: string;

    @Prop({ enum: paymentMethods })
    paymentMethod: string

    @Prop({ default: "" })
    paymentUrl: string

    @Prop({ default: "" })
    deeplink: string
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)