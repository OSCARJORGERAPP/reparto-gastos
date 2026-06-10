import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { validarNombreMiembro } from '@/lib/validation';
import { Grupo, Usuario } from '@/types';

/**
 * POST /api/groups/[nombre]/miembros
 * Agrega un miembro a un grupo
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { nombre: string } }
) {
  try {
    const nombre = params.nombre;
    const body = await request.json();
    const { nombreMiembro } = body;

    // Validar nombre del miembro
    const validación = validarNombreMiembro(nombreMiembro);
    if (!validación.válido) {
      return NextResponse.json(
        { error: validación.error },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Obtener el grupo
    const grupo = await db.collection<Grupo>('groups').findOne({
      nombre: { $regex: `^${nombre}$`, $options: 'i' },
    });

    if (!grupo) {
      return NextResponse.json(
        { error: 'Grupo no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el miembro no exista ya
    if (grupo.miembros.some((m) => m.nombre.toLowerCase() === nombreMiembro.toLowerCase())) {
      return NextResponse.json(
        { error: 'El miembro ya existe en el grupo' },
        { status: 409 }
      );
    }

    // Crear usuario
    const nuevoUsuario: Usuario = {
      grupoId: grupo._id || new ObjectId(),
      nombre: nombreMiembro,
      creadoEn: new Date(),
    };

    const resultadoUsuario = await db.collection('users').insertOne(nuevoUsuario);
    const userId = resultadoUsuario.insertedId.toString();

    // Agregar miembro al grupo
    const ahora = new Date();
    await db.collection('groups').updateOne(
      { _id: grupo._id },
      {
        $push: {
          miembros: {
            userId,
            nombre: nombreMiembro,
            uniéndoseEn: ahora,
          } as any,
        },
        $set: { actualizadoEn: ahora },
      } as any
    );

    return NextResponse.json(
      {
        userId,
        nombre: nombreMiembro,
        uniéndoseEn: ahora,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en POST /api/groups/[nombre]/miembros:', error);
    return NextResponse.json(
      { error: 'Error al agregar miembro' },
      { status: 500 }
    );
  }
}
