import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Script de seed para llenar la base de datos con datos iniciales
 * Ejecutar con: npm run db:seed
 */
async function seedDatabase() {
  console.log('🌱 Iniciando seed de datos...\n');

  try {
    const db = await getDb();

    // Limpiar colecciones existentes
    console.log('🗑️  Limpiando colecciones...');
    await db.collection('groups').deleteMany({});
    await db.collection('expenses').deleteMany({});
    await db.collection('users').deleteMany({});
    console.log('✅ Colecciones limpiadas\n');

    // Crear grupo 1: Viaje a París
    console.log('📍 Creando grupo: Viaje a París');
    const grupo1Id = new ObjectId();
    const grupo1 = {
      _id: grupo1Id,
      nombre: 'Viaje a París',
      miembros: [],
      creadoEn: new Date('2026-01-15'),
      actualizadoEn: new Date('2026-01-15'),
    };
    await db.collection('groups').insertOne(grupo1);
    console.log(`✅ Grupo creado: ${grupo1.nombre}\n`);

    // Crear usuarios para grupo 1
    console.log('👥 Creando usuarios para grupo 1');
    const usuarios1 = [
      { nombre: 'Ana', grupoId: grupo1Id, creadoEn: new Date('2026-01-15') },
      { nombre: 'Bruno', grupoId: grupo1Id, creadoEn: new Date('2026-01-15') },
      { nombre: 'Carlos', grupoId: grupo1Id, creadoEn: new Date('2026-01-15') },
    ];

    const usuariosIds1 = [];
    for (const usuario of usuarios1) {
      const resultado = await db.collection('users').insertOne(usuario);
      usuariosIds1.push(resultado.insertedId.toString());
      console.log(`   - ${usuario.nombre} (${resultado.insertedId})`);
    }

    // Agregar miembros al grupo 1
    await db.collection('groups').updateOne(
      { _id: grupo1Id },
      {
        $set: {
          miembros: usuariosIds1.map((id, index) => ({
            userId: id,
            nombre: usuarios1[index].nombre,
            uniéndoseEn: usuarios1[index].creadoEn,
          })),
        },
      }
    );
    console.log('✅ Miembros agregados al grupo 1\n');

    // Crear gastos para grupo 1
    console.log('💰 Creando gastos para grupo 1');
    const gastos1 = [
      {
        grupoId: grupo1Id,
        pagadoPor: usuariosIds1[0], // Ana
        monto: 120,
        descripción: 'Hotel 3 noches',
        participantes: usuariosIds1, // Todos
        creadoEn: new Date('2026-01-16'),
      },
      {
        grupoId: grupo1Id,
        pagadoPor: usuariosIds1[1], // Bruno
        monto: 75,
        descripción: 'Comida en restaurante',
        participantes: usuariosIds1, // Todos
        creadoEn: new Date('2026-01-16'),
      },
      {
        grupoId: grupo1Id,
        pagadoPor: usuariosIds1[2], // Carlos
        monto: 45,
        descripción: 'Transporte en taxi',
        participantes: usuariosIds1, // Todos
        creadoEn: new Date('2026-01-17'),
      },
      {
        grupoId: grupo1Id,
        pagadoPor: usuariosIds1[0], // Ana
        monto: 60,
        descripción: 'Entradas a museo',
        participantes: usuariosIds1, // Todos
        creadoEn: new Date('2026-01-17'),
      },
    ];

    for (const gasto of gastos1) {
      await db.collection('expenses').insertOne(gasto);
      console.log(`   - $${gasto.monto}: ${gasto.descripción} (pagó ${usuarios1[usuariosIds1.indexOf(gasto.pagadoPor)].nombre})`);
    }
    console.log('✅ Gastos creados\n');

    // Crear grupo 2: Cena de Amigos
    console.log('📍 Creando grupo: Cena de Amigos');
    const grupo2Id = new ObjectId();
    const grupo2 = {
      _id: grupo2Id,
      nombre: 'Cena de Amigos',
      miembros: [],
      creadoEn: new Date('2026-02-01'),
      actualizadoEn: new Date('2026-02-01'),
    };
    await db.collection('groups').insertOne(grupo2);
    console.log(`✅ Grupo creado: ${grupo2.nombre}\n`);

    // Crear usuarios para grupo 2
    console.log('👥 Creando usuarios para grupo 2');
    const usuarios2 = [
      { nombre: 'Diana', grupoId: grupo2Id, creadoEn: new Date('2026-02-01') },
      { nombre: 'Enrique', grupoId: grupo2Id, creadoEn: new Date('2026-02-01') },
      { nombre: 'Fernanda', grupoId: grupo2Id, creadoEn: new Date('2026-02-01') },
      { nombre: 'Gastón', grupoId: grupo2Id, creadoEn: new Date('2026-02-01') },
    ];

    const usuariosIds2 = [];
    for (const usuario of usuarios2) {
      const resultado = await db.collection('users').insertOne(usuario);
      usuariosIds2.push(resultado.insertedId.toString());
      console.log(`   - ${usuario.nombre} (${resultado.insertedId})`);
    }

    // Agregar miembros al grupo 2
    await db.collection('groups').updateOne(
      { _id: grupo2Id },
      {
        $set: {
          miembros: usuariosIds2.map((id, index) => ({
            userId: id,
            nombre: usuarios2[index].nombre,
            uniéndoseEn: usuarios2[index].creadoEn,
          })),
        },
      }
    );
    console.log('✅ Miembros agregados al grupo 2\n');

    // Crear gastos para grupo 2
    console.log('💰 Creando gastos para grupo 2');
    const gastos2 = [
      {
        grupoId: grupo2Id,
        pagadoPor: usuariosIds2[0], // Diana
        monto: 150,
        descripción: 'Vino y bebidas',
        participantes: usuariosIds2, // Todos
        creadoEn: new Date('2026-02-01'),
      },
      {
        grupoId: grupo2Id,
        pagadoPor: usuariosIds2[1], // Enrique
        monto: 200,
        descripción: 'Comida (entrada, plato principal, postre)',
        participantes: usuariosIds2, // Todos
        creadoEn: new Date('2026-02-01'),
      },
      {
        grupoId: grupo2Id,
        pagadoPor: usuariosIds2[2], // Fernanda
        monto: 80,
        descripción: 'Propina y mesa reservada',
        participantes: usuariosIds2, // Todos
        creadoEn: new Date('2026-02-01'),
      },
    ];

    for (const gasto of gastos2) {
      await db.collection('expenses').insertOne(gasto);
      console.log(`   - $${gasto.monto}: ${gasto.descripción} (pagó ${usuarios2[usuariosIds2.indexOf(gasto.pagadoPor)].nombre})`);
    }
    console.log('✅ Gastos creados\n');

    // Resumen
    console.log('📊 Resumen del seed:\n');
    const gruposCount = await db.collection('groups').countDocuments();
    const usuariosCount = await db.collection('users').countDocuments();
    const gastosCount = await db.collection('expenses').countDocuments();

    console.log(`✨ Base de datos inicializada exitosamente:`);
    console.log(`   - Grupos: ${gruposCount}`);
    console.log(`   - Usuarios: ${usuariosCount}`);
    console.log(`   - Gastos: ${gastosCount}`);
    console.log('\n🎉 ¡Seed completado!\n');

    console.log('📝 Próximos pasos:');
    console.log('   1. Ejecuta: npm run dev');
    console.log('   2. Visita: http://localhost:3000');
    console.log('   3. Accede al grupo "Viaje a París" o "Cena de Amigos"');
    console.log('   4. ¡Verás los datos del seed!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:\n');
    console.error(error);
    console.error(
      '\n💡 Soluciones:\n' +
        '1. Verifica que MongoDB está corriendo: npm run db:verify\n' +
        '2. Inicia MongoDB si no está corriendo: npm run db:start\n' +
        '3. Revisa MONGODB_SETUP.md para más ayuda'
    );
    process.exit(1);
  }
}

seedDatabase();
