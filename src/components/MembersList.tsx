'use client';

import { Miembro } from '@/types';
import styles from './MembersList.module.css';

interface MembersListProps {
  members: Miembro[];
}

export function MembersList({ members }: MembersListProps) {
  if (members.length === 0) {
    return <div className={styles.empty}>No hay miembros en este grupo</div>;
  }

  return (
    <div className={styles.container}>
      <h3>Miembros ({members.length})</h3>
      <div className={styles.list}>
        {members.map((miembro) => (
          <div key={miembro.userId} className={styles.item}>
            <span className={styles.name}>👤 {miembro.nombre}</span>
            <span className={styles.date}>
              Se unió: {new Date(miembro.uniéndoseEn).toLocaleDateString('es-ES')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
