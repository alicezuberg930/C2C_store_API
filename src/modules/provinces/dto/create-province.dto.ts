import { IsNotEmpty } from "class-validator";

export class CreateProvinceDto {
    @IsNotEmpty({ message: "Tên thành phố không được trống" })
    fullName: string

    @IsNotEmpty({ message: "Tên mã không được trống" })
    codeName: string

    @IsNotEmpty({ message: "Mã không được trống" })
    code: string
}
