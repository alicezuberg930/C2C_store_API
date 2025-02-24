import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Brand, BrandDocument } from './schemas/brand.schema'
import { Model, Types } from 'mongoose'
// import { Category, CategoryDocument } from '../categories/schemas/category.schema'

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<BrandDocument>) { }
  // @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  async create(brandData: CreateBrandDto) {
    try {
      let categoryIds: Types.ObjectId[] = []
      if (brandData.categories) {
        for (let i = 0; i < brandData.categories.length; i++) {
          // const category = await this.categoryModel.findById(brandData.categories[i])
          // if (!category) throw new NotFoundException('Có 1 ngành hàng không tồn tại')
          categoryIds.push(new Types.ObjectId(brandData.categories[i]))
        }
      }
      const brand = await this.brandModel.create({ ...brandData, categories: categoryIds })
      return brand
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll() {
    try {
      const brands = await this.brandModel.aggregate([
        // { $match: { _id: _id } }, // Match the specific brand
        {
          $lookup: {
            from: 'categories', // The collection to join
            localField: 'categories', // Field in the `brands` collection
            foreignField: '_id', // Field in the `categories` collection
            as: 'categories', // The resulting array field
          },
        },
      ])
      return { payload: brands }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(id: string) {
    try {
      let brand = await this.brandModel.findById(id).populate({
        path: 'categories',
        select: '-createdAt -updatedAt -subCategories -description -parentCategoryId',
      })
      if (!brand) throw new NotFoundException('Không tìm thấy thương hiệu')
      return brand
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, brandData: UpdateBrandDto) {
    try {
      let categoryIds: Types.ObjectId[] = []
      if (brandData.categories) {
        for (let i = 0; i < brandData.categories.length; i++) {
          // const category = await this.categoryModel.findById(brandData.categories[i])
          // if (!category) throw new NotFoundException('Có 1 ngành hàng không tồn tại')
          categoryIds.push(new Types.ObjectId(brandData.categories[i]))
        }
      }
      const brand = await this.brandModel.findOneAndUpdate({ _id: id }, { ...brandData, categories: categoryIds }, { new: true })
      if (!brand) throw new NotFoundException('Không tìm thấy thương hiệu')
      return brand.populate({
        path: 'categories',
        select: '-createdAt -updatedAt -subCategories -description -parentCategoryId',
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(id: string) {
    try {
      const deletedBrand = await this.brandModel.findOneAndDelete({ _id: id })
      if (!deletedBrand) throw new NotFoundException('Không tìm thấy thương hiệu')
      return deletedBrand
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}