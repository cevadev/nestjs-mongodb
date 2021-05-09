import { Injectable, NotFoundException } from '@nestjs/common';

import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private producModel: Model<Product>) {}

  findAll() {
    //lanzamos un query a la bd de mongo para obtener los products
    return this.producModel.find().exec();
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
