import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPassword } from 'src/common/utils';
import aqp from 'api-query-params';
import { RegisterDto } from '../auth/dto/create-auth.dto';
import { v4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyDto } from '../auth/dto/verify-auth.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private mailerService: MailerService) { }

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
      const { email, password } = userData
      if (await this.isEmailExist(email)) throw new BadRequestException('Email đã tồn tại')
      const hashedPassword = await hashPassword(password)
      const user = await this.userModel.create({ ...userData, password: hashedPassword })
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async get(page: number, pageSize: number) {
    try {
      if (!page) page = 1
      if (!pageSize) pageSize = 5
      const totalRows = (await this.userModel.find({})).length
      const totalPages = Math.ceil(totalRows / pageSize)
      const skip = (page - 1) * pageSize
      const users: Model<User>[] = await this.userModel.aggregate([
        {
          $lookup: {
            from: 'transactions', // The name of the transaction collection
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

  async show(id: string) {
    try {
      const user = await this.userModel.findById(id)
      if (!user) throw new NotFoundException('Không tìm thấy người dùng')
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, userData: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.updateOne({ _id: id }, { ...userData })
      if (!updatedUser) throw new NotFoundException('Không tìm thấy người dùng')
      return updatedUser
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
}