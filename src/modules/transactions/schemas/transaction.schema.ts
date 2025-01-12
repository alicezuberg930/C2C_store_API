import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { transactionStatuses, transactionTypes } from "../enum";

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true, enum: transactionTypes })
    type: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ default: Date.now })
    date: Date;

    @Prop({ required: true, enum: transactionStatuses })
    status: string;

    @Prop()
    description: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);