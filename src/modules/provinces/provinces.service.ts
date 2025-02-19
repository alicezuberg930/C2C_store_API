import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Province, ProvinceDocument } from './schemas/province.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProvincesService {
  constructor(@InjectModel(Province.name) private provinceModel: Model<ProvinceDocument>) { }

  async create(provinceData: CreateProvinceDto) {
    try {
      return await this.provinceModel.create({ ...provinceData })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll() {
    try {
      return await this.provinceModel.find()
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} province`;
  }

  update(id: number, provinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
