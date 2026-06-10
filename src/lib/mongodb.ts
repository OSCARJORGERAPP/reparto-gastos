import { MongoClient, Db } from 'mongodb';

const MONGODB_DB = 'reparto-gastos';

/**
 * Interfaz global para TypeScript
 */
declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoDb: Db | undefined;
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Obtiene la URI de MongoDB desde las variables de entorno
 */
function getMongoDBUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'Por favor define la variable de entorno MONGODB_URI. ' +
        'Verifica que .env.local está configurado correctamente.'
    );
  }
  return uri;
}

/**
 * Obtiene la instancia de MongoClient
 * Usa un patrón singleton para reutilizar la conexión
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = getMongoDBUri();
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

/**
 * Obtiene la instancia de la base de datos MongoDB
 */
export async function getDb(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await getMongoClient();
  cachedDb = client.db(MONGODB_DB);
  return cachedDb;
}

/**
 * Cierra la conexión a MongoDB
 * (generalmente solo se necesita al cerrar la aplicación)
 */
export async function closeMongoConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}
