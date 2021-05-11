import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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
