
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop({ length: 10 })
    phone: string

    @Prop()
    address: string

    @Prop()
    avatar: string

    @Prop({ default: "LOCAL" })
    accountType: string

    @Prop({ default: false })
    isEmailVerified: boolean

    @Prop()
    codeId: string

    @Prop()
    codeExpired: number
}

export const UserSchema = SchemaFactory.createForClass(User);
