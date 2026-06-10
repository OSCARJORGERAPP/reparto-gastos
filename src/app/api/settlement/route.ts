import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { generarResultadoLiquidación } from '@/lib/settlement';
import { Grupo, Gasto } from '@/types';

/**
 * GET /api/settlement?grupoNombre=NombreGrupo
 * Obtiene la liquidación de un grupo
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
      .toArray();

    // Generar liquidación
    const resultado = generarResultadoLiquidación(grupo._id?.toString() || '', gastos);

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Error en GET /api/settlement:', error);
    return NextResponse.json(
      { error: 'Error al calcular liquidación' },
      { status: 500 }
    );
  }
}
