import { Prop } from "@nestjs/mongoose"

export class Attribute {
    @Prop()
    name: string

    @Prop()
    price: number

    @Prop()
    stock: number

    @Prop()
    image: string

    @Prop()
    weight: number

    @Prop()
    length: number

    @Prop()
    width: number

    @Prop()
    height: number
}

