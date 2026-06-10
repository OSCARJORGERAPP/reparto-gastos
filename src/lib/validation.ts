/**
 * Valida que un nombre de grupo sea válido
 */
export function validarNombreGrupo(nombre: string): { válido: boolean; error?: string } {
  if (!nombre || typeof nombre !== 'string') {
    return { válido: false, error: 'El nombre del grupo es requerido' };
  }

  nombre = nombre.trim();

  if (nombre.length < 1) {
    return { válido: false, error: 'El nombre del grupo no puede estar vacío' };
  }

  if (nombre.length > 100) {
    return { válido: false, error: 'El nombre del grupo no puede exceder 100 caracteres' };
  }

  return { válido: true };
}

/**
 * Valida que un nombre de miembro sea válido
 */
export function validarNombreMiembro(nombre: string): { válido: boolean; error?: string } {
  if (!nombre || typeof nombre !== 'string') {
    return { válido: false, error: 'El nombre del miembro es requerido' };
  }

  nombre = nombre.trim();

  if (nombre.length < 1) {
    return { válido: false, error: 'El nombre del miembro no puede estar vacío' };
  }

  if (nombre.length > 100) {
    return { válido: false, error: 'El nombre del miembro no puede exceder 100 caracteres' };
  }

  return { válido: true };
}

/**
 * Valida que un gasto sea válido
 */
export function validarGasto(gasto: {
  monto?: number;
  descripción?: string;
  pagadoPor?: string;
  participantes?: string[];
}): { válido: boolean; error?: string } {
  // Validar monto
  if (typeof gasto.monto !== 'number' || gasto.monto <= 0) {
    return { válido: false, error: 'El monto del gasto debe ser mayor que 0' };
  }

  // Validar descripción
  if (!gasto.descripción || typeof gasto.descripción !== 'string') {
    return { válido: false, error: 'La descripción es requerida' };
  }

  gasto.descripción = gasto.descripción.trim();

  if (gasto.descripción.length < 1) {
    return { válido: false, error: 'La descripción no puede estar vacía' };
  }

  if (gasto.descripción.length > 200) {
    return { válido: false, error: 'La descripción no puede exceder 200 caracteres' };
  }

  // Validar que pagadoPor sea un usuario válido
  if (!gasto.pagadoPor || typeof gasto.pagadoPor !== 'string') {
    return { válido: false, error: 'El usuario que paga es requerido' };
  }

  // Validar participantes
  if (!Array.isArray(gasto.participantes) || gasto.participantes.length === 0) {
    return { válido: false, error: 'Debe haber al menos un participante' };
  }

  return { válido: true };
}

/**
 * Sanitiza un string de entrada
 */
export function sanitizar(input: string): string {
  return input.trim().replace(/[<>\"\']/g, '');
}
