import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsOptional, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DeliveryAddressDto {
    @IsOptional()
    city: string

    @IsOptional()
    district: string

    @IsOptional()
    ward: string

    @IsOptional()
    street: string

    @IsOptional()
    address: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    balance: number

    @ValidateNested({ each: true }) // Ensures validation for each item in the array
    @Type(() => DeliveryAddressDto) // Specifies the class type for transformation
    // @IsOptional()
    deliveryAddress: DeliveryAddressDto
}