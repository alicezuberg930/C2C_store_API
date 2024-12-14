import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigDto } from './dto/config.dto';
import { ResponseMessage } from 'src/public_decorator';

@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) { }

  @Post()
  @ResponseMessage("Cập nhật thông tin thành công")
  configSite(@Body() createConfigDto: ConfigDto) {
    return this.configsService.configSite(createConfigDto);
  }

  // bỏ phần này
  // @Get()
  // findAll() {
  //   return this.configsService.findAll();
  // }

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
