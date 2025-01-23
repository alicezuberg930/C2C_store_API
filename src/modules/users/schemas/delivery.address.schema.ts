import { Prop, Schema } from "@nestjs/mongoose"

@Schema({ timestamps: false })
export class DeliveryAddress {
    @Prop()
    city: string

    @Prop()
    district: string

    @Prop()
    ward: string

    @Prop()
    street: string

    @Prop()
    address: string
}
