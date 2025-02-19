import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ResponseMessage } from 'src/public.decorator';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) { }

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @ResponseMessage('Lấy dữ liệu tỉnh/thành thành công')
  @Get('provinces')
  findProvinces() {
    return this.locationsService.findProvinces();
  }

  @ResponseMessage('Lấy dữ liệu quận/huyện thành công')
  @Get('districts/:provinceId')
  findDistricts(@Param('provinceId') provinceId: string) {
    return this.locationsService.findDistricts(provinceId);
  }

  @ResponseMessage('Lấy dữ liệu phường/xã thành công')
  @Get('wards/:districtId')
  findWards(@Param('districtId') districtId: string) {
    return this.locationsService.findWards(districtId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(+id);
  }
}
