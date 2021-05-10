import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
//importamos una funcion validadora (esta funcionaes todas inician con minusculas)
import { isMongoId } from 'class-validator';

@Injectable()
export class MongoIdPipe implements PipeTransform {
  //validamos si el string que recibimos como id es un mongoId utilizando los class valdator
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isMongoId(value)) {
      throw new BadRequestException(`${value} is not a mongo Id valid`);
    }
    return value;
  }
}
