import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { validarNombreGrupo } from '@/lib/validation';
import { Grupo } from '@/types';

/**
 * GET /api/groups
 * Sin parámetros: Obtiene todos los grupos
 * Con ?nombre=NombreGrupo: Obtiene un grupo específico por nombre
 */
export async function GET(request: NextRequest) {
  try {
    const nombre = request.nextUrl.searchParams.get('nombre');
    const db = await getDb();

    // Si se proporciona nombre, buscar grupo específico
    if (nombre) {
      const grupo = await db.collection<Grupo>('groups').findOne({
        nombre: { $regex: `^${nombre}$`, $options: 'i' }, // Búsqueda insensible a mayúsculas
      });

      if (!grupo) {
        return NextResponse.json(
          { error: 'Grupo no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json(grupo);
    }

    // Si no se proporciona nombre, obtener todos los grupos
    const grupos = await db
      .collection<Grupo>('groups')
      .find({})
      .sort({ creadoEn: -1 })
      .toArray();

    return NextResponse.json(grupos);
  } catch (error) {
    console.error('Error en GET /api/groups:', error);
    return NextResponse.json(
      { error: 'Error al obtener los grupos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/groups
 * Crea un nuevo grupo
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre } = body;

    // Validar nombre
    const validación = validarNombreGrupo(nombre);
    if (!validación.válido) {
      return NextResponse.json(
        { error: validación.error },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Verificar que el nombre no exista ya
    const grupoExistente = await db.collection<Grupo>('groups').findOne({
      nombre: { $regex: `^${nombre}$`, $options: 'i' },
    });

    if (grupoExistente) {
      return NextResponse.json(
        { error: 'El nombre del grupo ya existe' },
        { status: 409 }
      );
    }

    // Crear nuevo grupo
    const nuevoGrupo: Grupo = {
      nombre,
      miembros: [],
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    };

    const resultado = await db.collection('groups').insertOne(nuevoGrupo);

    return NextResponse.json(
      { ...nuevoGrupo, _id: resultado.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en POST /api/groups:', error);
    return NextResponse.json(
      { error: 'Error al crear el grupo' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/groups
 * Elimina uno o más grupos, junto con sus miembros y gastos
 * Body: { nombres: string[] }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombres } = body;

    if (!nombres || !Array.isArray(nombres) || nombres.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de nombres de grupos para eliminar' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Obtener los IDs de los grupos a eliminar
    const grupos = await db
      .collection<Grupo>('groups')
      .find({
        nombre: {
          $in: nombres.map(
            (n) => new RegExp(`^${n}$`, 'i')
          ),
        },
      })
      .toArray();

    const grupoIds = grupos.map((g) => g._id);

    if (grupoIds.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron grupos para eliminar' },
        { status: 404 }
      );
    }

    // Eliminar gastos del grupo
    await db.collection('expenses').deleteMany({
      grupoId: { $in: grupoIds },
    });

    // Eliminar el grupo
    const resultado = await db.collection('groups').deleteMany({
      _id: { $in: grupoIds },
    });

    return NextResponse.json(
      {
        mensaje: `Se eliminaron ${resultado.deletedCount} grupo(s) con todos sus miembros y gastos`,
        gruposEliminados: resultado.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en DELETE /api/groups:', error);
    return NextResponse.json(
      { error: 'Error al eliminar los grupos' },
      { status: 500 }
    );
  }
}
