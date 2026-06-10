'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Navigation.module.css';

export function Navigation() {
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          💰 Reparto Gastos
        </Link>
        <div className={styles.links}>
          <button
            onClick={() => router.back()}
            className={styles.backButton}
            title="Volver atrás"
          >
            ← Atrás
          </button>
        </div>
      </div>
    </nav>
  );
}
