import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigDto } from './dto/configs.dto';
import { Public, ResponseMessage } from 'src/public.decorator';

@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) { }

  @Public()
  @Post()
  @ResponseMessage("Cập nhật thông tin thành công")
  configSite(@Body() createConfigDto: ConfigDto) {
    return this.configsService.configSite(createConfigDto);
  }

  @Public()
  @ResponseMessage("Lấy thông tin thành công")
  @Get()
  findAll() {
    return this.configsService.findAll();
  }

  // bỏ phần này
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.configsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateConfigDto: UpdateConfigDto) {
  //   return this.configsService.update(+id, updateConfigDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.configsService.remove(+id);
  // }
}
