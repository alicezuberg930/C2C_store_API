import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { ProductQuery } from './query/product.query';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

  async create(productDto: ProductDto) {
    let price: number = productDto.price ?? 0 //min price
    let stock: number = productDto.stock ?? 0 //total stock
    if (productDto.variations) {
      price = productDto.variations[0].attributes[0].price
      productDto.variations.forEach(variation => {
        variation.attributes.forEach(attribute => {
          if (price > attribute.price) price = attribute.price
          stock += attribute.stock
        })
      })
    }
    const product = await this.productModel.create({ ...productDto, price, stock })
    return product
  }

  async findAll(query: ProductQuery) {
    try {
      const page: number = +(query.page ?? 1)
      const pageSize: number = +(query.pageSize ?? 10)
      const skip = (page - 1) * pageSize
      // filter options
      const filter: Record<string, any> = {};
      if (query.categoryId) filter.categoryId = query.categoryId;
      if (query.brandId) filter.brandId = query.brandId;

      const totalProducts = await this.productModel.countDocuments(filter)
      const products = await this.productModel.find(filter).limit(pageSize).skip(skip)
      const totalPages = Math.ceil(totalProducts / pageSize)
      return { payload: products, totalPages, pageSize, page }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      let a = await this.productModel.find({})
      for (let i = 0; i < a.length; i++) {
        await this.productModel.findByIdAndUpdate({ _id: a[i]._id }, { ...updateProductDto })
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(id: number) {
    await this.productModel.deleteMany({})
    return `This action removes a #${id} product`;
  }
}
