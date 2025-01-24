import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ResponseMessage } from 'src/public.decorator';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @ResponseMessage('Tạo thương hiệu thành công')
  @Post()
  create(@Body() brandData: CreateBrandDto) {
    return this.brandsService.create(brandData);
  }

  @ResponseMessage('Lấy danh sách thương hiệu thành công')
  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @ResponseMessage('Lấy thương hiệu thành công')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @ResponseMessage('Cập nhật thương hiệu thành công')
  @Patch(':id')
  update(@Param('id') id: string, @Body() brandData: UpdateBrandDto) {
    return this.brandsService.update(id, brandData);
  }

  @ResponseMessage('Xóa thương hiệu thành công')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
