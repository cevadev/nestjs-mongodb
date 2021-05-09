import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
//mongoose
import { MongooseModule } from '@nestjs/mongoose';

//importamos MongoClient para la conexion a MongoDB
import { MongoClient } from 'mongodb';

import config from '../config';

const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SA';

//establecemos la conexion a la BD
/* async function run() {
  //nos conectamos a la coleccion
  const taskCollection = database.collection('tasks');
  //obtenemos todas las tareas de la coleccion, como es asincrono usamos await
  const task = await taskCollection.find().toArray();
  //imprimimos el array de tareas
  console.info(task);
} */

//corremos nuestra funcion asincrona
//run();
@Global()
@Module({
  imports: [
    /* MongooseModule.forRoot('mongodb://localhost:27017', {
      user: 'root',
      pass: 'root',
      dbName: 'platzi-store',
    }), */
    //conexion con mongoose de manera asincrona, primero recibimos las variables luego establecemos conexion
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const {
          connection,
          user,
          password,
          host,
          port,
          dbName,
        } = configService.mongo;
        //retornamos el nuevo objeto de conexion
        return {
          uri: `${connection}://${host}:${port}`,
          user,
          pass: password,
          dbName,
        };
      },
      inject: [config.KEY],
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    //definimos nuestro provide Mongo
    {
      provide: 'MONGO',
      //useFactory hace posible que cualquier servicio pueda inyectar para ello lo incluimos en los exports
      //useFactory utiliza el patron singleton por lo que solo habra una instancia para toda la app
      //configService-> resolvemos la inyeccion
      useFactory: async (configService: ConfigType<typeof config>) => {
        //url de conexion, la copiamos desde el mongo compass
        //reemplazamos cada una de las variables con el config inyectado
        const {
          connection,
          user,
          password,
          host,
          port,
          dbName,
        } = configService.mongo;
        const uri = `${connection}://${user}:${password}@${host}:${port}/?authSource=admin&readPreference=primary`;
        //creamos una instancia del client
        const client = new MongoClient(uri);
        //ejecutamos el cliente
        await client.connect();
        //indicamos a la BD de queremos conectarnos
        //const database = client.db('platzi-store');
        const database = client.db(`${dbName}`);
        //retornamos la BD como injectable para todos los servicios
        return database;
      },
      //indicamos las dependencias que vamos a inyectar en el useFactory
      inject: [config.KEY],
    },
  ],
  //exportamos los providers para que cualquier otro servicio lo pueda utilizar
  exports: ['API_KEY', 'MONGO', MongooseModule],
})
export class DatabaseModule {}
