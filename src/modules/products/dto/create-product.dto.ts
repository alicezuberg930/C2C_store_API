import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";

export class ProductDto {
    @IsNotEmpty({ message: "Tên sản phẩm không được để trống" })
    title: string;

    @IsNotEmpty({ message: "Mô tả sản phẩm không được để trống" })
    description: string

    @IsNotEmpty({ message: "Ảnh sản phẩm không được trống" })
    images: string[]

    @IsOptional()
    weight: number

    @IsOptional()
    length: number

    @IsOptional()
    width: number

    @IsOptional()
    height: number

    @IsOptional()
    @ValidateNested({ each: true }) // Ensures validation for each item in the array
    @Type(() => VariationDto) // Specifies the class type for transformation
    variations: VariationDto[]

    @IsOptional()
    price: number

    @IsOptional()
    stock: number

    @IsOptional()
    category: string

    @IsOptional()
    brand: string
}

class VariationDto {
    @IsNotEmpty({ message: "Tên biến thể không được trống" })
    name: string

    @IsNotEmpty({ message: "Thuộc tính không được trống" })
    @ValidateNested({ each: true }) // Ensures validation for each item in the array
    @Type(() => AttributeDto) // Specifies the class type for transformation
    attributes: AttributeDto[]
}

class AttributeDto {
    @IsNotEmpty({ message: "Tên thuộc tính không được trống" })
    name: string

    @IsNotEmpty({ message: "Giá thuộc tính không được trống" })
    price: number

    @IsNotEmpty({ message: "Tồn kho thuộc tính không được trống" })
    stock: number

    @IsNotEmpty({ message: "Ảnh thuộc tính không được trống" })
    image: string

    @IsOptional()
    weight: number

    @IsOptional()
    length: number

    @IsOptional()
    width: number

    @IsOptional()
    height: number
}