import { Gasto, Transacción, ResultadoLiquidación } from '@/types';

/**
 * Calcula la liquidación para un conjunto de gastos
 * Retorna las transacciones necesarias para equilibrar las deudas
 */
export function calcularLiquidación(gastos: Gasto[]): Transacción[] {
  // Calcular saldos netos por usuario
  const saldos: Record<string, number> = {};

  for (const gasto of gastos) {
    // El que pagó tiene un saldo positivo (le deben)
    if (!saldos[gasto.pagadoPor]) {
      saldos[gasto.pagadoPor] = 0;
    }
    saldos[gasto.pagadoPor] += gasto.monto;

    // Dividir el gasto entre los participantes
    const montoPorPersona = gasto.monto / gasto.participantes.length;

    for (const participante of gasto.participantes) {
      if (!saldos[participante]) {
        saldos[participante] = 0;
      }
      saldos[participante] -= montoPorPersona;
    }
  }

  // Convertir saldos netos a transacciones mínimas
  const transacciones: Transacción[] = [];

  // Separar deudores (saldo negativo) y acreedores (saldo positivo)
  const deudores = Object.entries(saldos)
    .filter(([, saldo]) => saldo < -0.01) // Pequeño margen para errores de punto flotante
    .map(([usuario, saldo]) => ({ usuario, saldo: Math.abs(saldo) }))
    .sort((a, b) => b.saldo - a.saldo);

  const acreedores = Object.entries(saldos)
    .filter(([, saldo]) => saldo > 0.01)
    .map(([usuario, saldo]) => ({ usuario, saldo }))
    .sort((a, b) => b.saldo - a.saldo);

  // Emparejar deudores con acreedores
  let i = 0;
  let j = 0;

  while (i < deudores.length && j < acreedores.length) {
    const deudor = deudores[i];
    const acreedor = acreedores[j];

    const monto = Math.min(deudor.saldo, acreedor.saldo);

    transacciones.push({
      de: deudor.usuario,
      a: acreedor.usuario,
      monto: Math.round(monto * 100) / 100, // Redondear a 2 decimales
    });

    deudor.saldo -= monto;
    acreedor.saldo -= monto;

    if (deudor.saldo < 0.01) {
      i++;
    }
    if (acreedor.saldo < 0.01) {
      j++;
    }
  }

  return transacciones;
}

/**
 * Calcula los saldos netos por usuario
 */
export function calcularSaldos(gastos: Gasto[]): Record<string, number> {
  const saldos: Record<string, number> = {};

  for (const gasto of gastos) {
    // El que pagó tiene un saldo positivo (le deben)
    if (!saldos[gasto.pagadoPor]) {
      saldos[gasto.pagadoPor] = 0;
    }
    saldos[gasto.pagadoPor] += gasto.monto;

    // Dividir el gasto entre los participantes
    const montoPorPersona = gasto.monto / gasto.participantes.length;

    for (const participante of gasto.participantes) {
      if (!saldos[participante]) {
        saldos[participante] = 0;
      }
      saldos[participante] -= montoPorPersona;
    }
  }

  // Redondear a 2 decimales
  Object.keys(saldos).forEach((usuario) => {
    saldos[usuario] = Math.round(saldos[usuario] * 100) / 100;
  });

  return saldos;
}

/**
 * Genera el resultado de liquidación para un grupo
 */
export function generarResultadoLiquidación(
  grupoId: string,
  gastos: Gasto[]
): ResultadoLiquidación {
  const transacciones = calcularLiquidación(gastos);
  const saldos = calcularSaldos(gastos);
  
  // Calcular el total de gastos sumando todos los montos
  const totalGastos = Math.round(gastos.reduce((sum, gasto) => sum + gasto.monto, 0) * 100) / 100;

  return {
    grupoId,
    transacciones,
    saldos,
    totalGastos,
  };
}
