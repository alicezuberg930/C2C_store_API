import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Model, Types } from 'mongoose';
import { momoPayment, verifyMomoSignature } from 'src/common/utils';
import { log } from 'console';
// import { paymentMethods, transactionStatuses } from './enum';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) { }

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      let transaction = await this.transactionModel.create({
        ...createTransactionDto,
        userId: new Types.ObjectId(createTransactionDto.userId),
      })

      switch (transaction.paymentMethod) {
        case "momo":
          const momoResponse = await momoPayment({ requestId: transaction.id, orderId: transaction.id, amount: createTransactionDto.amount })
          transaction = await this.transactionModel.findOneAndUpdate({ _id: transaction.id }, { paymentUrl: momoResponse.payUrl, deeplink: momoResponse.deeplink }, { new: true })
          break
        case "zalopay":
          break
        case "onepay":
          break
        case "vnpay":
          break
      }
      return transaction
    } catch (error) {
      log(error.data)
      throw new BadRequestException(error)
    }
  }

  findAll() {
    // return this.transactionModel.find().populate('user', 'name email').exec();
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(id: number) {
    const a = await this.transactionModel.deleteMany({})
    return a.deletedCount
    // return `This action removes a #${id} transaction`;
  }

  async verifyMomoTransaction(query: any) {
    const { orderId } = query
    const isVerified = verifyMomoSignature(query);
    await this.transactionModel.findOneAndUpdate({ _id: orderId }, { status: "completed" })
    if (isVerified) {
      return { status: 'success', message: 'Payment verified successfully' };
    } else {
      return { status: 'error', message: 'Invalid signature' };
    }
  }
}
