import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import axios, { isAxiosError } from 'axios'
import crypto from 'crypto'
import { InjectModel } from '@nestjs/mongoose'
import { Order } from './schemas/order.schema'
import { Model } from 'mongoose'

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) { }

  async create(createOrderDto: CreateOrderDto) {
    let order = await this.orderModel.create({ ...createOrderDto })
    if (createOrderDto.paymentMethod == "momo") {
      let secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
      //json object send to MoMo endpoint
      const requestBody = {
        partnerCode: "MOMO",
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: order._id,
        // amount: createOrderDto.amount,
        orderId: order._id,
        orderInfo: "pay with MoMo",
        redirectUrl: "https://locahost:3000/test",
        ipnUrl: "https://locahost:3000/test",
        lang: 'vi',
        requestType: "captureWallet",
        autoCapture: true,
        extraData: '',
        orderGroupId: '',
        accessKey: 'F8BBA842ECF85',
      }
      // sort json object in key ascending order
      const sortedRequestBody = Object.keys(requestBody).sort().reduce((acc: any, key: string) => {
        acc[key] = requestBody[key]
        return acc
      }, {})
      // before sign HMAC SHA256 with format
      let excludeKeys: string[] = ["orderGroupId", "autoCapture", "storeId", "partnerName", "lang"]
      let rawSignature = Object.entries(sortedRequestBody).filter(([key]) => !excludeKeys.includes(key)).map(([key, value]) => `${key}=${value}`).join('&')
      let signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex')
      requestBody["signature"] = signature
      delete requestBody.accessKey
      try {
        let res = await axios({ url: `https://test-payment.momo.vn/v2/gateway/api/create`, method: "POST", timeout: 30000, data: requestBody })
        return res.data
      } catch (error) {
        if (isAxiosError(error))
          throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
      }
    }
  }

  findAll() {
    return `This action returns all orders`
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
