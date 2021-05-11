import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

//importamos la entidad que vamos a refrencias de 1 a 1
import { Brand } from './brand.entity';
@Schema()
export class Product extends Document {
  //id: number; quitamos el id ya que mongo lo va a definir por nosotros
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Number, index: true, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop()
  image: string;

  //atributo brand que hara referencia (1 a 1) a una Brand, el atributo brand guardara el ObjectId que hara referencia
  //a un objeto Brand
  @Prop({ type: Types.ObjectId, ref: Brand.name })
  brand: Brand | Types.ObjectId;

  //defenimos nuestra entidad embebida con raw
  @Prop(
    raw({
      //definimos el tipo de subobjeto
      name: { type: String },
      image: { type: String },
    }),
  )
  category: Record<string, any>;
}

//defiimos el schema a partir de nuestrs clase Product
export const ProductSchema = SchemaFactory.createForClass(Product);

//Indexacion compuesta
ProductSchema.index({
  //definimos los campos a indexar
  //price 1 -> el 1 significa ascendente
  //stock -1 -> indexado descendente
  price: 1,
  stock: -1,
});
