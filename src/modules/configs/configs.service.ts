import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigDto } from './dto/configs.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Config } from './schemas/config.schemas';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class ConfigsService {
  constructor(@InjectModel(Config.name) private configModel: Model<Config>) { }

  async configSite(createConfigDto: ConfigDto) {
    let config: mongoose.Document<unknown, {}, Config>
    try {
      if (await this.configModel.countDocuments() > 0) {
        config = await this.configModel.findOneAndUpdate({}, { ...createConfigDto }, { new: true })
      } else {
        config = await this.configModel.create({ ...createConfigDto })
      }
      return config
    } catch (error) {
      throw new BadRequestException("Cập nhật thông tin thất bại")
    }
  }

  async findAll() {
    return await this.configModel.findOne()
  }

  // bỏ phần này
  // findOne(id: number) {
  //   return `This action returns a #${id} config`;
  // }

  // update(id: number, updateConfigDto: UpdateConfigDto) {
  //   return `This action updates a #${id} config`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} config`;
  // }
}
