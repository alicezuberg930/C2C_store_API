import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import axios, { isAxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
// import { InjectModel } from '@nestjs/mongoose';
// import { User } from '../users/schemas/user.schema';
// import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(private configService: ConfigService) { }

  async create(createMessageDto: CreateMessageDto) {
  }

  async findAll() {
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUpdates`
      )
      return response.data
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response.data
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
