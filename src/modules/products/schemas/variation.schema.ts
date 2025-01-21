import { Prop } from "@nestjs/mongoose"
import { Attribute } from "./attribute.schema"

export class Variation {
    @Prop()
    name: string

    @Prop({ type: [Attribute] })
    attributes: Attribute[]
}

