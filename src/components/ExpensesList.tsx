'use client';

import { Gasto, Miembro } from '@/types';
import styles from './ExpensesList.module.css';

interface ExpensesListProps {
  expenses: Gasto[];
  members: Miembro[];
}

export function ExpensesList({ expenses, members }: ExpensesListProps) {
  const getMemberName = (userId: string) => {
    return members.find((m) => m.userId === userId)?.nombre || 'Desconocido';
  };

  if (expenses.length === 0) {
    return <div className={styles.empty}>No hay gastos en este grupo</div>;
  }

  return (
    <div className={styles.container}>
      <h3>Gastos ({expenses.length})</h3>
      <div className={styles.list}>
        {expenses.map((gasto) => (
          <div key={gasto._id?.toString()} className={styles.item}>
            <div className={styles.info}>
              <div className={styles.description}>📝 {gasto.descripción}</div>
              <div className={styles.details}>
                <span className={styles.payer}>Pagó: {getMemberName(gasto.pagadoPor)}</span>
                <span className={styles.participants}>
                  Participantes: {gasto.participantes.length}
                </span>
                <span className={styles.date}>
                  {new Date(gasto.creadoEn).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
            <div className={styles.amount}>${gasto.monto.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
