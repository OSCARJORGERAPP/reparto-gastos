import { ObjectId } from 'mongodb';

/**
 * Representa un miembro del grupo
 */
export interface Miembro {
  userId: string;
  nombre: string;
  uniéndoseEn: Date;
}

/**
 * Representa un grupo de gastos
 */
export interface Grupo {
  _id?: ObjectId;
  nombre: string;
  miembros: Miembro[];
  creadoEn: Date;
  actualizadoEn: Date;
}

/**
 * Representa un gasto
 */
export interface Gasto {
  _id?: ObjectId;
  grupoId: ObjectId | string;
  pagadoPor: string;
  monto: number;
  descripción: string;
  participantes: string[];
  creadoEn: Date;
}

/**
 * Representa un usuario
 */
export interface Usuario {
  _id?: ObjectId;
  grupoId: ObjectId | string;
  nombre: string;
  creadoEn: Date;
}

/**
 * Representa la liquidación de una transacción
 */
export interface Transacción {
  de: string;
  a: string;
  monto: number;
}

/**
 * Resultado de la liquidación de un grupo
 */
export interface ResultadoLiquidación {
  grupoId: string;
  transacciones: Transacción[];
  saldos: Record<string, number>; // Por usuario
  totalGastos: number; // Total de todos los gastos
}

/**
 * Respuesta de error de la API
 */
export interface RespuestaError {
  error: string;
  detalles?: string;
}
