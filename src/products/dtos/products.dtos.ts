import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Min,
  ValidateIf,
  ValidateNested,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

//importamos Category.dto para incluirla dentro de la entiedad Product
import { CreateCategoryDto } from '../dtos/category.dtos';
import { Type } from 'class-transformer';
import { CreateSubDocDto } from './subdoc.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `product's name` })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty() //permite hacer la actualizacion de las propiedades
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly stock: number;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  readonly image: string;

  //definimos la entiedad embebida Category
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty()
  readonly category: CreateCategoryDto;

  //validamos que seaun mongoid
  @IsNotEmpty()
  @IsMongoId()
  readonly brand: string;

  //validamos relacion 1:1
  @IsNotEmpty()
  @ValidateNested()
  readonly subDoc: CreateSubDocDto;

  //Validamos el campo SubDoc: 1 a muchos
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubDocDto)
  readonly subDocs: CreateSubDocDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

//dto para filtrar productos
export class FilterProductsDto {
  //atributos para la paginacion, son opcionales y deben ser numeros positivos desde 0 en adelante
  @IsOptional()
  @IsPositive()
  limit: number; //limit-> #de productos que quiero como resultado

  @IsOptional()
  @Min(0) //valores desde 0 en adelante
  offset: number; //offset-> #de producto que quiero saltar de la tabla de productos

  @IsOptional()
  @Min(0)
  minPrice: number;

  //maxPirce será obligatorio si y solo si se ingreso un minPrice
  @ValidateIf((params) => params.minPrice)
  @IsPositive()
  maxPrice: number;
}
