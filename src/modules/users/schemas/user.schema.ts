
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Wallet } from './wallet.schema'

export type CatDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string

    @Prop()
    email: string

    @Prop({ select: false })
    password: string

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

    @Prop({ type: Date })
    codeExpired: Date

    @Prop({ type: Wallet })
    wallet: Wallet
}

const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', function (next) {
    if (!this.wallet) {
        this.wallet = { balance: 0 }
    }
    next()
})

// UserSchema.virtual('transactions', {    
//     ref: 'Transaction', // The model to use
//     localField: '_id',  // The field in the user schema
//     foreignField: 'userId', // The field in the transaction schema
// })

// UserSchema.set('toObject', { virtuals: true })
// UserSchema.set('toJSON', { virtuals: true })

export { UserSchema }