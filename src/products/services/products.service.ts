import { Injectable, NotFoundException } from '@nestjs/common';

import { Product } from './../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from './../dtos/products.dtos';

import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private producModel: Model<Product>) {}

  //parametros opcionales, si los envia el controlador Ok
  findAll(params?: FilterProductsDto) {
    if (params) {
      //filtro generico tipado (FilterQuery) para aplicar otros filtros como por marca, por tipo, etc
      const filters: FilterQuery<Product> = {};
      //extraemos los parametros
      const { limit, offset } = params;
      const { minPrice, maxPrice } = params;
      if (minPrice && maxPrice) {
        //establecemos nuestros filtros con rando
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }
      //lanzamos un query a la bd de mongo para obtener los products paginados
      //si no tenemos filtros envia un objeto vacio que los pasamos al metodo find()
      return this.producModel.find(filters).skip(offset).limit(limit).exec();
    }
  }

  async findOne(id: string) {
    const product = await this.producModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(data: CreateProductDto) {
    const newProduct = new this.producModel(data);
    return newProduct.save();
  }

  update(id: string, changes: UpdateProductDto) {
    const product = this.producModel
      .findByIdAndUpdate(
        id,
        {
          //indicamos que actualice unicamente las proppiedades que han sido modificadas y no todo el objeto
          $set: changes,
        },
        //indicamos que queremos ver los datos modificados una vez hecha la actualizacion
        {
          new: true,
        },
      )
      .exec();

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
  }

  remove(id: string) {
    return this.producModel.findByIdAndDelete(id);
  }
}
