import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

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
