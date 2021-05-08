import { Module, Global } from '@nestjs/common';

//importamos MongoClient para la conexion a MongoDB
import { MongoClient } from 'mongodb';
import { async } from 'rxjs';

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
      useFactory: async () => {
        //url de conexion, la copiamos desde el mongo compass
        const uri =
          'mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary';
        //creamos una instancia del client
        const client = new MongoClient(uri);
        //ejecutamos el cliente
        await client.connect();
        //indicamos a la BD de queremos conectarnos
        const database = client.db('platzi-store');
        //retornamos la BD como injectable para todos los servicios
        return database;
      },
    },
  ],
  exports: ['API_KEY', 'MONGO'],
})
export class DatabaseModule {}
