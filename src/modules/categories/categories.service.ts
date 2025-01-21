import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CategoryDocument, Category } from './schemas/category.schema'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) { }

  async create(categoryData: CreateCategoryDto) {
    let { parentCategoryId } = categoryData
    try {
      if (parentCategoryId) {
        const parentCategory = await this.categoryModel.findById(parentCategoryId)
        if (!parentCategory) throw new NotFoundException('Không tìm thấy ngành hàng cha')
        // tạo ngành hàng con
        const childCategory = await this.categoryModel.create({ ...categoryData, parentCategoryId: new Types.ObjectId(parentCategoryId) })
        // thêm id ngành hàng con vào ngành hàng cha
        parentCategory.subCategories.push(childCategory._id)
        await parentCategory.save()
        return childCategory
      }
      const category = await this.categoryModel.create({ ...categoryData })
      return category
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  private async populateChildren(id: Types.ObjectId) {
    const populatedCategory = await this.categoryModel.findById(id).populate('subCategories')
    let subCategories = await Promise.all(populatedCategory.subCategories.map(category => this.populateChildren(category._id)))
    return { ...populatedCategory.toObject(), subCategories }
  }

  async findAll() {
    try {
      const parentCategories = await this.categoryModel.find({ parentCategoryId: null })
      const allCategories = await Promise.all(parentCategories.map(category => this.populateChildren(category._id)))
      return { payload: allCategories }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.categoryModel.findById(id).populate('subCategories')
      if (!category) throw new NotFoundException('Không tìm thấy ngành hàng')
      const subCategories = await Promise.all(category.subCategories.map(category => this.populateChildren(category)))
      return { ...category.toObject(), subCategories }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  private async deleteChildren(parentCategoryId: Types.ObjectId) {
    const children = await this.categoryModel.find({ parentCategoryId })
    for (const child of children) {
      await this.deleteChildren(child._id)
      await this.categoryModel.findByIdAndDelete(child._id)
    }
  }

  async delete(id: string) {
    try {
      const category = await this.categoryModel.findById(id)
      if (!category) throw new NotFoundException('Không tìm thấy thương hiệu')
      // Remove the reference from the parent's children array (if parent exists)
      if (category.parentCategoryId) {
        await this.categoryModel.findByIdAndUpdate(
          category.parentCategoryId, { $pull: { subCategories: category._id } }, // Remove the id from the parent's children array
        )
      }
      // Recursively delete all subcategories
      await this.deleteChildren(category._id)
      // Delete the category itself
      await this.categoryModel.findByIdAndDelete(id)
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, categoryData: UpdateCategoryDto) {
    const { parentCategoryId } = categoryData
    try {
      // Fetch the category and its original parent in a single query
      const category = await this.categoryModel.findById(id);
      if (!category) throw new NotFoundException('Ngành hàng không tồn tại');
      // check if a parent category is in request body
      if (parentCategoryId) {
        // get the selected parent category
        const parentCategory = await this.categoryModel.findById(parentCategoryId)
        // check if the selected parent category exists
        if (!parentCategory) throw new NotFoundException('Ngành hàng cha không tồn tại')
        // Check if the parent category is different from the current parent category
        if (!category.parentCategoryId.equals(parentCategory._id)) {
          // Add to the new parent's subcategories
          await parentCategory.updateOne({ $push: { subCategories: category._id } })
          // Remove from the old parent's subcategories if it exists
          if (category.parentCategoryId)
            await this.categoryModel.findByIdAndUpdate(category.parentCategoryId, { $pull: { subCategories: category._id } })
        }
      }
      await category.updateOne({ ...categoryData, parentCategoryId: new Types.ObjectId(parentCategoryId) })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
