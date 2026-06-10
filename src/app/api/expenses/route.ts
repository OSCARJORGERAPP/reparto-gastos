import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { validarGasto } from '@/lib/validation';
import { Gasto, Grupo } from '@/types';

/**
 * GET /api/expenses?grupoNombre=NombreGrupo
 * Obtiene todos los gastos de un grupo
 */
export async function GET(request: NextRequest) {
  try {
    const grupoNombre = request.nextUrl.searchParams.get('grupoNombre');

    if (!grupoNombre) {
      return NextResponse.json(
        { error: 'El parámetro "grupoNombre" es requerido' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Obtener el grupo
    const grupo = await db.collection<Grupo>('groups').findOne({
      nombre: { $regex: `^${grupoNombre}$`, $options: 'i' },
    });

    if (!grupo) {
      return NextResponse.json(
        { error: 'Grupo no encontrado' },
        { status: 404 }
      );
    }

    // Obtener gastos del grupo
    const gastos = await db
      .collection<Gasto>('expenses')
      .find({ grupoId: grupo._id })
      .sort({ creadoEn: -1 })
      .toArray();

    return NextResponse.json(gastos);
  } catch (error) {
    console.error('Error en GET /api/expenses:', error);
    return NextResponse.json(
      { error: 'Error al obtener gastos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/expenses
 * Crea un nuevo gasto en un grupo
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { grupoNombre, monto, descripción, pagadoPor, participantes } = body;

    // Validar gasto
    const validación = validarGasto({ monto, descripción, pagadoPor, participantes });
    if (!validación.válido) {
      return NextResponse.json(
        { error: validación.error },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Obtener el grupo
    const grupo = await db.collection<Grupo>('groups').findOne({
      nombre: { $regex: `^${grupoNombre}$`, $options: 'i' },
    });

    if (!grupo) {
      return NextResponse.json(
        { error: 'Grupo no encontrado' },
        { status: 404 }
      );
    }

    // Validar que pagadoPor y participantes sean miembros del grupo
    const miembrosIds = grupo.miembros.map((m) => m.userId);

    if (!miembrosIds.includes(pagadoPor)) {
      return NextResponse.json(
        { error: 'El usuario que paga no es miembro del grupo' },
        { status: 400 }
      );
    }

    const participantesValidos = participantes.every((p: string) => miembrosIds.includes(p));
    if (!participantesValidos) {
      return NextResponse.json(
        { error: 'Uno o más participantes no son miembros del grupo' },
        { status: 400 }
      );
    }

    // Crear gasto
    const nuevoGasto: Gasto = {
      grupoId: grupo._id || new ObjectId(),
      pagadoPor,
      monto,
      descripción,
      participantes,
      creadoEn: new Date(),
    };

    const resultado = await db.collection('expenses').insertOne(nuevoGasto);

    // Actualizar fecha de actualización del grupo
    await db.collection('groups').updateOne(
      { _id: grupo._id },
      { $set: { actualizadoEn: new Date() } }
    );

    return NextResponse.json(
      { ...nuevoGasto, _id: resultado.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en POST /api/expenses:', error);
    return NextResponse.json(
      { error: 'Error al crear gasto' },
      { status: 500 }
    );
  }
}
