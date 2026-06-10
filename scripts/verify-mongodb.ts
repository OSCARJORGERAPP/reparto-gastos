import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { getDb, getMongoClient } from '@/lib/mongodb';

/**
 * Script para verificar la conexión a MongoDB
 * Ejecutar con: npx tsx scripts/verify-mongodb.ts
 */
async function verificarMongoDB() {
  console.log('🔍 Verificando conexión a MongoDB...\n');

  // Validar que MONGODB_URI esté definida
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está definida');
    console.error(
      '\n💡 Soluciones:\n' +
        '1. Verifica que .env.local existe en la carpeta raíz\n' +
        '2. Revisa que contiene MONGODB_URI=mongodb://localhost:27017/reparto-gastos\n' +
        '3. Revisa MONGODB_SETUP.md para más ayuda'
    );
    process.exit(1);
  }

  try {
    console.log('📌 Intentando conectar...');
    const client = await getMongoClient();
    console.log('✅ Conexión establecida\n');

    console.log('📌 Obteniendo base de datos...');
    const db = await getDb();
    const nombreBd = db.name;
    console.log(`✅ Base de datos: ${nombreBd}\n`);

    console.log('📌 Listando colecciones...');
    const colecciones = await db.listCollections().toArray();
    console.log(`✅ Colecciones encontradas: ${colecciones.length}`);
    colecciones.forEach((col) => {
      console.log(`   - ${col.name}`);
    });
    console.log();

    console.log('📌 Verificando índices...');
    try {
      const indices = await db.collection('groups').getIndexes();
      console.log(`✅ Índices en "groups": ${Object.keys(indices).length}`);
      Object.keys(indices).forEach((indice) => {
        console.log(`   - ${indice}`);
      });
    } catch {
      console.log('⚠️  La colección "groups" aún no existe (se creará al usar la app)');
    }
    console.log();

    console.log('✨ ¡MongoDB está configurado correctamente!\n');
    console.log('📊 Estadísticas:');
    console.log(`   - URI: ${process.env.MONGODB_URI}`);
    console.log(`   - Base de datos: ${nombreBd}`);
    console.log(`   - Colecciones: ${colecciones.map((c) => c.name).join(', ')}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:\n');
    console.error(error);
    console.error(
      '\n💡 Soluciones:\n' +
        '1. Verifica que MongoDB está corriendo: docker-compose ps\n' +
        '2. Inicia MongoDB si no está corriendo: docker-compose up -d\n' +
        '3. Revisa MONGODB_SETUP.md para más ayuda'
    );
    process.exit(1);
  }
}

verificarMongoDB();
