import { IsOptional } from "class-validator"

export class ProductQuery {
    @IsOptional()
    page: string

    @IsOptional()
    pageSize: string

    @IsOptional()
    title: string

    @IsOptional()
    categoryId: string

    @IsOptional()
    brandId: string
}