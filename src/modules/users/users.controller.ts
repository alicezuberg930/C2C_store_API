import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ResponseMessage } from 'src/public.decorator'
import { UserQuery } from './query/user.query'
import { DeliveryAddressDto } from './dto/delivery.address.dto'
import { CurrentUser } from 'src/id.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ResponseMessage('Đăng ký thành công')
  @Post()
  create(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData)
  }

  @ResponseMessage('Lấy dữ liệu thành công')
  @Get()
  findAll(@Query() query: UserQuery) {
    return this.usersService.findAll(query)
  }

  @Get('profile')
  findOne(@CurrentUser('_id') userId: string) {
    return this.usersService.findOne(userId)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    return this.usersService.update(id, userData)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id)
  }

  @ResponseMessage('Lấy dữ liệu thành công')
  @Get('delivery/address')
  findAllDeliveryAddress(@CurrentUser('_id') userId: string) {
    return this.usersService.findAllDeliveryAddress(userId)
  }

  @ResponseMessage('Tạo địa chỉ thành công')
  @Post('delivery/address')
  createDeliveryAddress(@CurrentUser('_id') userId: string, @Body() deliveryAddressData: DeliveryAddressDto) {
    return this.usersService.createDeliveryAddress(userId, deliveryAddressData)
  }

  @ResponseMessage('Cập nhật địa chỉ thành công')
  @Patch('delivery/address/:id')
  updateDeliveryAddress(@CurrentUser('_id') userId: string, @Body() deliveryAddressData: DeliveryAddressDto, @Param('id') id: string) {
    return this.usersService.updateDeliveryAddress(userId, deliveryAddressData, id)
  }

  @ResponseMessage('Xóa địa chỉ thành công')
  @Delete('delivery/address/:id')
  deleteDeliveryAddress(@CurrentUser('_id') userId: string, @Param('id') id: string) {
    return this.usersService.deleteDeliveryAddress(userId, id)
  }
}
