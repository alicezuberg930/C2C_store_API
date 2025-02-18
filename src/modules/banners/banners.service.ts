import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Banner, BannerDocument } from './shemas/banner.schema';
import { Model } from 'mongoose';

@Injectable()
export class BannersService {
  constructor(@InjectModel(Banner.name) private bannerModel: Model<BannerDocument>) { }

  async create(bannerData: CreateBannerDto) {
    try {
      return await this.bannerModel.create({ ...bannerData })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll() {
    try {
      const banners = await this.bannerModel.find()
      return { payload: banners }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findOne(id: number) {

  }

  update(id: number, updateBannerDto: UpdateBannerDto) {
    return `This action updates a #${id} banner`;
  }

  remove(id: number) {
    return `This action removes a #${id} banner`;
  }
}
