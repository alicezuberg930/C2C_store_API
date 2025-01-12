import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import axios, { isAxiosError } from 'axios'
import crypto from 'crypto'
import { InjectModel } from '@nestjs/mongoose'
import { Order } from './schemas/order.schema'
import { Model } from 'mongoose'
import { momoPayment } from 'src/common/utils'

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) { }

  async create(createOrderDto: CreateOrderDto) {
    let order = await this.orderModel.create({ ...createOrderDto })
    if (createOrderDto.paymentMethod == "momo") {
      const requestBody = momoPayment({ requestId: order.id, orderId: order.id, amount: createOrderDto.amount })
      try {
        let res = await axios({ url: `https://test-payment.momo.vn/v2/gateway/api/create`, method: "POST", timeout: 30000, data: requestBody })
        return { order: order, payment: res.data }
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response) throw new BadRequestException(error.response.data)
          else throw new BadRequestException()
        }
      }
    }
  }

  findAll() {
    const orders = this.orderModel.find()
    return orders
  }

  findOne(id: number) {
    return `This action returns a #${id} order`
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`
  }

  remove(id: number) {
    return `This action removes a #${id} order`
  }
}
