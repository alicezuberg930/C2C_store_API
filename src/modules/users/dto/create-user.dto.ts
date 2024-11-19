import { IsEmail, IsNotEmpty, Length, Max } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: "Tên người dùng không được để trống" })
    name: string;

    @IsEmail({}, { message: "Email sai định dạng" })
    email: string;

    // @Max(20)
    @IsNotEmpty()
    password: string;

    @Length(10, 10)
    phone: string

    address: string

    avatar: string
}
