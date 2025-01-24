import { Controller, Get, Post, Delete, Body, Param, Patch } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { ResponseMessage } from 'src/public.decorator'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) { }

  @ResponseMessage('Tạo ngành hàng thành công')
  @Post()
  create(@Body() categoryData: CreateCategoryDto) {
    return this.categoryService.create(categoryData)
  }

  @ResponseMessage('Lấy danh sách ngành hàng thành công')
  @Get()
  findAll() {
    return this.categoryService.findAll()
  }

  @ResponseMessage('Lấy ngành hàng thành công')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id)
  }

  @ResponseMessage('Xóa ngành hàng thành công')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.delete(id)
  }

  @ResponseMessage('Sửa ngành hàng thành công')
  @Patch(':id')
  update(@Param('id') id: string, @Body() categoryData: UpdateCategoryDto) {
    return this.categoryService.update(id, categoryData)
  }
}