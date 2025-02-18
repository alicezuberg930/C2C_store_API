import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model, Types } from 'mongoose';
import { ProductQuery } from './query/product.query';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) { }

  async create(productData: ProductDto) {
    try {
      const { category, brand } = productData
      let price: number = productData.price ?? 0 //min price
      let stock: number = productData.stock ?? 0 //total stock
      if (productData.variations) {
        price = productData.variations[0].attributes[0].price
        productData.variations.forEach(variation => {
          variation.attributes.forEach(attribute => {
            if (price > attribute.price) price = attribute.price
            stock += attribute.stock
          })
        })
      }
      const product = await this.productModel.create({
        ...productData, price, stock,
        category: new Types.ObjectId(category),
        brand: new Types.ObjectId(brand)
      })
      return product
    } catch (error) {
      throw new BadRequestException(error)
    }
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
      const totalPages = Math.ceil(totalProducts / pageSize)
      const products = await this.productModel.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'categories', // The collection to join
            localField: 'category', // Field in the `products` collection
            foreignField: '_id', // Field in the `categories` collection
            as: 'category', // The resulting array field
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'brands', // The collection to join
            localField: 'brand', // Field in the `products` collection
            foreignField: '_id', // Field in the `brands` collection
            as: 'brand', // The resulting array field
          },
        },
        { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            category: {
              createdAt: 0,
              updatedAt: 0,
              subCategories: 0
            },
            brand: {
              createdAt: 0,
              updatedAt: 0,
              categories: 0
            },
          },
        },
      ]).skip(skip).limit(pageSize)
      return { payload: products, totalPages, pageSize, page }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findOne(id: string) {
    try {
      const product = this.productModel.findById(id)
        .populate({
          path: 'brand',
          select: '-createdAt -updatedAt -categories -description',
        })
        .populate({
          path: 'category',
          select: '-createdAt -updatedAt -subCategories -description -parentCategoryId',
        })
      if (!product) throw new NotFoundException('Không tìm thấy sản phẩm')
      return product
    } catch (error) {
      throw new BadRequestException(error)
    }
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

  async remove(id: string) {
    try {
      const deletedProduct = await this.productModel.findOneAndDelete({ _id: id })
      if (!deletedProduct) throw new NotFoundException("Không tìm thấy sản phẩm")
      return deletedProduct
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
