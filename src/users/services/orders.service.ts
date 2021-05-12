import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  findAll() {
    return this.orderModel
      .find()
      .populate('customer')
      .populate('products')
      .exec();
  }

  async findOne(id: string) {
    return this.orderModel.findById(id);
  }

  create(data: CreateOrderDto) {
    const newModel = new this.orderModel(data);
    return newModel.save();
  }

  update(id: string, changes: UpdateOrderDto) {
    return this.orderModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.orderModel.findByIdAndDelete(id);
  }

  //metdo para remover un producto de la orden
  async removeProduct(id: string, productId: string) {
    //obtenemos la orden de compra
    const order = await this.orderModel.findById(id);
    //sacamos el producto del pedido
    order.products.pull(productId);
    return order.save();
  }

  //add product or products to an order
  async addProducts(id: string, productsIds: string[]) {
    //const order = await this.orderModel.findByIdAndUpdate(id, {
    //$addToSet nos permite evitar Ids duplicados, este operador solo agregara elementos al array si el o los ids no
    //se encuentran
    //$addToSet: { productos: productsIds },
    //});
    const order = await this.orderModel.findById(id);
    //recorremos los products a ser añadidos y por cada item lo incluiamos a la orden
    productsIds.forEach((productId) => order.products.push(productId));
    //guardamos el estado del pedido
    return order.save();
  }
}
