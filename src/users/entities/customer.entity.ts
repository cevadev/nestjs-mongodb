import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Customer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phone: string;

  //relacion uno a muchos embebida. Utilizamos el tipo Array que nos provee mongo
  //utilizamos Record<> para indicar que se trata de una propiedad embebida
  @Prop({
    //definimos el tipo del atrbuto
    type: [
      {
        //definimos ls atributos del skill
        name: { type: String },
        color: { type: String },
      },
    ],
  })
  skills: Types.Array<Record<string, any>>;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
