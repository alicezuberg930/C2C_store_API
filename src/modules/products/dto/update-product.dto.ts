import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from './create-product.dto';
import { IsOptional } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    categoryId: string

    @IsOptional()
    brandId: string
}

// extends PartialType(ProductDto) {}
