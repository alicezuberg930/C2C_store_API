import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, UserDocument } from './schemas/user.schema'
import mongoose, { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { hashPassword } from 'src/common/utils'
import { RegisterDto } from '../auth/dto/create-auth.dto'
import { v4 } from 'uuid'
import dayjs from 'dayjs'
import { MailerService } from '@nestjs-modules/mailer'
import { VerifyDto } from '../auth/dto/verify-auth.dto'
import { UserQuery } from './query/user.query'
import { DeliveryAddressDto } from './dto/delivery.address.dto'
import { Location, LocationDocument } from '../locations/schemas/location.schemas'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailerService: MailerService,
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>
  ) { }

  async isEmailExist(email: string): Promise<boolean> {
    const isExist = await this.userModel.exists({ email })
    if (isExist) return true
    return false
  }

  async findUserByIdentifier(id: string) {
    return await this.userModel.findOne({ email: id })
  }

  async create(userData: CreateUserDto) {
    try {
      if (await this.isEmailExist(userData.email)) throw new BadRequestException('Email đã tồn tại')
      const hashedPassword = await hashPassword(userData.password)
      return await this.userModel.create({ ...userData, password: hashedPassword })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll(query: UserQuery) {
    try {
      const page: number = +(query.page ?? 1)
      const pageSize: number = +(query.pageSize ?? 10)
      const skip = (page - 1) * pageSize
      // filter options
      const filter: Record<string, any> = {}
      if (query.name) filter.name = query.name
      const totalUsers = await this.userModel.countDocuments(filter)
      const totalPages = Math.ceil(totalUsers / pageSize)
      const users = await this.userModel.aggregate([
        {
          $lookup: {
            from: 'transactions', // The name of the transactions collection
            localField: '_id', // The field in the user schema
            foreignField: 'userId', // The field in the transaction schema
            as: 'transactions', // The name of the field to store the joined data
          },
        },
        {
          $project: {
            'password': 0,
            'transactions.userId': 0,
          }
        },
      ]).limit(pageSize).skip(skip)
      return { payload: users, totalPages, pageSize, page }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(userId: string) {
    try {
      const user = await this.userModel.findById(userId)
      if (!user) throw new NotFoundException('Không tìm thấy người dùng')
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, userData: UpdateUserDto) {
    try {
      const user = await this.userModel.findById(id)
      if (!user) throw new NotFoundException('Không tìm thấy người dùng')
      return await this.userModel.findOneAndUpdate({ _id: id }, { ...userData }, { new: true })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async delete(id: string) {
    try {
      const deletedUser = await this.userModel.findOneAndDelete({ _id: id })
      if (!deletedUser) throw new NotFoundException('Không tìm thấy người dùng')
      return deletedUser
    } catch (error) {
      throw new BadRequestException(error
      )
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const { email, password } = registerDto
      if (await this.isEmailExist(email)) throw new BadRequestException('Email đã tồn tại')
      const hashedPassword = await hashPassword(password)
      const user = await this.userModel.create({ ...registerDto, password: hashedPassword, codeId: v4(), codeExpired: dayjs().add(5, 'minutes') })
      await this.sendMail(user)
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async sendMail(user: mongoose.Document<unknown, {}, User> & User) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Activate your account',
        template: 'register',
        context: {
          name: user?.name ?? user?.email,
          activationCode: user.codeId
        }
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async verify(data: VerifyDto) {
    try {
      const user = await this.userModel.findOne({ _id: data.id, codeId: data.code })
      if (!user) throw new BadRequestException('Mã không hợp lệ hoặc hết hạn')
      const isBefore = dayjs().isBefore(user.codeExpired)
      if (isBefore) {
        await this.userModel.updateOne({ _id: data.id }, { isEmailVerified: true })
      } else {
        throw new BadRequestException('Mã đã hết hạn')
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAllDeliveryAddress(userId: string) {
    try {
      let user = await this.userModel.findById({ _id: userId })
      if (!user) throw new NotFoundException('Người dùng không tồn tại')
      for (let i = 0; i < user.deliveryAddresses.length; i++) {
        let city = await this.locationModel.findOne({ code: user.deliveryAddresses[i].city })
        let district = city.district.find(item => item.code === user.deliveryAddresses[i].district)
        let ward = district.ward.find(item => item.code === user.deliveryAddresses[i].ward)
        user.deliveryAddresses[i].city = city.fullName
        user.deliveryAddresses[i].district = district.fullName
        user.deliveryAddresses[i].ward = ward.fullName
      }
      return user.deliveryAddresses
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async createDeliveryAddress(userId: string, deliveryAddressData: DeliveryAddressDto) {
    try {
      if (deliveryAddressData.isDefault == true) {
        await this.userModel.updateOne(
          { _id: userId, 'deliveryAddresses.isDefault': true },
          { $set: { 'deliveryAddresses.$[].isDefault': false } },
        )
      }
      const result = await this.userModel.findOneAndUpdate(
        { _id: userId },
        { $push: { 'deliveryAddresses': deliveryAddressData } },
        { new: true },
      )
      return result.deliveryAddresses.at(-1)
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async updateDeliveryAddress(userId: string, deliveryAddressData: DeliveryAddressDto, id: string) {
    try {
      if (deliveryAddressData.isDefault == true) {
        await this.userModel.updateOne(
          { _id: userId, 'deliveryAddresses.isDefault': true },
          { $set: { 'deliveryAddresses.$[].isDefault': false } },
        )
      }
      const updatedAddress = await this.userModel.findOneAndUpdate(
        { _id: userId, 'deliveryAddresses._id': new Types.ObjectId(id) },
        { $set: { 'deliveryAddresses.$': { ...deliveryAddressData, _id: new Types.ObjectId(id) } } },
        { new: true },
      )
      if (!updatedAddress) throw new NotFoundException('Không tìm thấy địa chỉ')
      return updatedAddress.deliveryAddresses
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async deleteDeliveryAddress(userId: string, id: string) {
    try {
      const deletedAddress = await this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { deliveryAddresses: { _id: id } }
        },
        { new: true },
      )
      if (!deletedAddress) throw new NotFoundException('Không tìm thấy địa chỉ')
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}