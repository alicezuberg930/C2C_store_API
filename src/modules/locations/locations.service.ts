import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Document, Model, Types } from 'mongoose'
import { Location, LocationDocument } from './schemas/location.schemas'

@Injectable()
export class LocationsService {
  constructor(@InjectModel(Location.name) private locationModel: Model<LocationDocument>) { }

  create(createLocationDto: CreateLocationDto) {
    return 'This action adds a new location'
  }

  async findProvinces() {
    try {
      return await this.locationModel.find().select('-district')
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findDistricts(provinceId: string) {
    try {
      const data = await this.locationModel.aggregate([
        { $match: { type: "province", code: provinceId } },
        { $unwind: "$district" },
        {
          $project: {
            _id: 0,
            type: "$district.type",
            code: "$district.code",
            name: "$district.name",
            fullName: "$district.fullName",
            codeName: "$district.codeName",
            provinceCode: "$district.provinceCode"
          }
        }
      ])
      return data
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findWards(districtCode: string) {
    try {
      const data = await this.locationModel.aggregate([
        { $unwind: "$district" },
        { $match: { "district.code": districtCode } },
        { $unwind: "$district.ward" },
        {
          $project: {
            _id: 0,
            type: "$district.ward.type",
            code: "$district.ward.code",
            name: "$district.ward.name",
            fullName: "$district.ward.fullName",
            codeName: "$district.ward.codeName",
            districtCode: "$district.ward.districtCode"
          }
        }
      ])
      return data
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} location`
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`
  }

  remove(id: number) {
    return `This action removes a #${id} location`
  }
}
