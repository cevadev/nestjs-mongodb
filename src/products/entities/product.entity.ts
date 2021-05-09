import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Product extends Document {
  //id: number; quitamos el id ya que mongo lo va a definir por nosotros
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop()
  image: string;
}

//defiimos el schema a partir de nuestrs clase Product
export const ProductSchema = SchemaFactory.createForClass(Product);
