import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProvinceDocument = HydratedDocument<Province>

@Schema({ timestamps: true })
export class Province {
    @Prop()
    fullName: string

    @Prop()
    codeName: string

    @Prop()
    code: string
}

export const ProvinceSchema = SchemaFactory.createForClass(Province)