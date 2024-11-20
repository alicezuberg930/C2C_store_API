import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    // @IsNotEmpty({ message: "Tên người dùng không được để trống" })
    @IsOptional()
    name: string;

    @IsOptional()
    @IsEmail({}, { message: "Email sai định dạng" })
    email: string;

    @IsOptional()
    @Length(10, 10)
    phone: string

    @IsOptional()
    address: string

    @IsOptional()
    avatar: string
}
