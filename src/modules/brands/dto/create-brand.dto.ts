import { IsNotEmpty, IsOptional } from "class-validator"

export class CreateBrandDto {
    @IsNotEmpty({ message: "Tên thương hiệu không được để trống" })
    name: string

    @IsOptional()
    description: string

    @IsNotEmpty({ message: "Ảnh thương hiệu không được để trống" })
    image: string

    @IsOptional()
    categories: string[]
}
