import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CatDocument = HydratedDocument<Config>;

@Schema({ timestamps: true })
export class Config {
    @Prop()
    company: string

    @Prop()
    slogan: string

    @Prop()
    phone: string

    @Prop()
    telephone: string

    @Prop()
    hotline: string

    @Prop()
    address: string

    @Prop()
    openHour: string

    @Prop()
    googleMap: string

    @Prop()
    email: string

    @Prop()
    zaloChatURL: string

    @Prop()
    facebookChatURL: string

    @Prop()
    facebookPage: string

    @Prop()
    googlePage: string

    @Prop()
    youtubePage: string

    @Prop()
    footerInfo: string

    @Prop({ type: JSON })
    footerContact: JSON

    @Prop()
    fax: string

    @Prop()
    facebookID: string
}

export const ConfigSchema = SchemaFactory.createForClass(Config);