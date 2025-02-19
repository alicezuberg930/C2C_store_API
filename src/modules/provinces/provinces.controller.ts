import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { ResponseMessage } from 'src/public.decorator';

@Controller('provinces')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) { }

  @ResponseMessage('Tạo tỉnh/thành phố thành công')
  @Post()
  create(@Body() provinceData: CreateProvinceDto) {
    return this.provincesService.create(provinceData);
  }

  @ResponseMessage('Lấy dữ liệu thành công')
  @Get()
  findAll() {
    return this.provincesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provincesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProvinceDto: UpdateProvinceDto) {
    return this.provincesService.update(+id, updateProvinceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.provincesService.remove(+id);
  }
}
