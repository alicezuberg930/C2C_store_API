import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) { }

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const transaction = await this.transactionModel.create({
        ...createTransactionDto,
        userId: new Types.ObjectId(createTransactionDto.userId),
      })
      return transaction
    } catch (error) {
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

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
