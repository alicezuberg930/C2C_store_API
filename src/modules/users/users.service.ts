import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private mailerService: MailerService) { }

  async isEmailExist(email: string) {
    const isExist = await this.userModel.exists({ email })
    if (isExist) return true
    return false
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, avatar } = createUserDto
    if (await this.isEmailExist(email)) {
      throw new BadRequestException(["Email đã tồn tại"])
    }
    const hashedPassword = await hashPassword(password)
    const user = await this.userModel.create({
      name, email, password: hashedPassword, phone, address, avatar
    })
    return {
      id: user._id
    };
  }

  async get(query: string, page: number, pageSize: number) {
    const { filter, limit, sort } = aqp(query)
    if (!page) page = 1
    if (!pageSize) pageSize = 5
    //  Tổng số dữ liệu
    const totalRows = (await this.userModel.find({})).length
    const totalPages = Math.ceil(totalRows / pageSize)
    const skip = (page - 1) * pageSize

    const results = await this.userModel.find({}).limit(pageSize).skip(skip).sort(sort as any).select("-password")
    return { results, totalPages }
  }

  show(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: id }, { ...updateUserDto })
  }

  delete(id: number) {
    if (mongoose.isValidObjectId(id)) {
      return this.userModel.deleteOne({ _id: id })
    } else {
      throw new BadRequestException(["ID sai định dạng"])
    }
  }

  async findUserByIdentifier(id: string) {
    return await this.userModel.findOne({ email: id })
  }

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto
    if (await this.isEmailExist(email)) {
      throw new BadRequestException(["Email đã tồn tại"])
    }
    const hashedPassword = await hashPassword(password)
    const user = await this.userModel.create({
      name, email, password: hashedPassword,
      codeId: v4(), codeExpired: dayjs().add(5, 'minutes')
    })
    await this.sendMail(user)
    return user;
  }

  async sendMail(user: mongoose.Document<unknown, {}, User> & User) {
    try {
      const mail = await this.mailerService.sendMail({
        to: user.email,
        subject: "Activate your account",
        template: "register",
        context: {
          name: user?.name ?? user?.email,
          activationCode: user.codeId
        }
      })
    } catch (error) {
      return { error }
    }
  }
}
