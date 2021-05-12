import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Customer } from './customer.entity';

//importamos la entidad Product para hacer la refrencia
import { Product } from '../../products/entities/product.entity';
@Schema()
export class Order extends Document {
  @Prop({ type: Date })
  date: Date;

  //Realacion de 1 -> 1 de manera embebida (referencia hacia Customer)
  //1 Orden pertenece a un Cliente en especifico o 1 Cliente posee una orden
  @Prop({ type: Types.ObjectId, ref: Customer.name, required: true })
  customer: Customer | Types.ObjectId;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: Product.name,
      },
    ],
  })
  products: Types.Array<Product>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
