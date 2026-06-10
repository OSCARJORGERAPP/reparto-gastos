'use client';

import { Transacción, Miembro } from '@/types';
import styles from './Settlement.module.css';

interface SettlementProps {
  transactions: Transacción[];
  balances: Record<string, number>;
  members: Miembro[];
  totalExpenses?: number;
}

export function Settlement({ transactions, balances, members, totalExpenses }: SettlementProps) {
  const getMemberName = (userId: string) => {
    return members.find((m) => m.userId === userId)?.nombre || 'Desconocido';
  };

  const getTotalExpenses = () => {
    return totalExpenses ?? Object.values(balances).reduce((sum, bal) => sum + (bal > 0 ? bal : 0), 0);
  };

  return (
    <div className={styles.container}>
      <h3>🧮 Liquidación</h3>

      <div className={styles.total}>
        <span>Total de gastos:</span>
        <span className={styles.amount}>${getTotalExpenses().toFixed(2)}</span>
      </div>

      <div className={styles.section}>
        <h4>Saldos por persona</h4>
        <div className={styles.balances}>
          {Object.entries(balances).map(([userId, balance]) => (
            <div key={userId} className={styles.balance}>
              <span className={styles.name}>{getMemberName(userId)}</span>
              <span
                className={`${styles.balance_amount} ${
                  balance > 0 ? styles.positive : balance < 0 ? styles.negative : styles.zero
                }`}
              >
                {balance > 0 ? '+' : ''}${balance.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className={styles.section}>
          <h4>Transacciones necesarias</h4>
          <div className={styles.transactions}>
            {transactions.map((tx, index) => (
              <div key={index} className={styles.transaction}>
                <span className={styles.from}>{getMemberName(tx.de)}</span>
                <span className={styles.arrow}>→</span>
                <span className={styles.to}>{getMemberName(tx.a)}</span>
                <span className={styles.amount}>${tx.monto.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.balanced}>✅ ¡Todos están al día!</div>
      )}
    </div>
  );
}
