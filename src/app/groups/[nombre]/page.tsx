'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { MembersList } from '@/components/MembersList';
import { AddMember } from '@/components/AddMember';
import { ExpensesList } from '@/components/ExpensesList';
import { AddExpense } from '@/components/AddExpense';
import { Settlement } from '@/components/Settlement';
import { Grupo, Gasto, Transacción, Miembro } from '@/types';
import styles from './page.module.css';

export default function GroupPage() {
  const params = useParams();
  const grupoNombre = decodeURIComponent(params.nombre as string);

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [transacciones, setTransacciones] = useState<Transacción[]>([]);
  const [saldos, setSaldos] = useState<Record<string, number>>({});
  const [totalGastos, setTotalGastos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    try {
      setError('');
      setCargando(true);

      // Obtener grupo
      const respuestaGrupo = await fetch(
        `/api/groups?nombre=${encodeURIComponent(grupoNombre)}`
      );

      if (!respuestaGrupo.ok) {
        throw new Error('Grupo no encontrado');
      }

      const grupoData = await respuestaGrupo.json();
      setGrupo(grupoData);

      // Obtener gastos
      const respuestaGastos = await fetch(
        `/api/expenses?grupoNombre=${encodeURIComponent(grupoNombre)}`
      );

      if (respuestaGastos.ok) {
        const gastosData = await respuestaGastos.json();
        setGastos(gastosData || []);
      }

      // Obtener liquidación
      const respuestaLiquidación = await fetch(
        `/api/settlement?grupoNombre=${encodeURIComponent(grupoNombre)}`
      );

      if (respuestaLiquidación.ok) {
        const liquidación = await respuestaLiquidación.json();
        setTransacciones(liquidación.transacciones || []);
        setSaldos(liquidación.saldos || {});
        setTotalGastos(liquidación.totalGastos || 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setCargando(false);
    }
  };

  const manejarEliminarGrupo = async () => {
    if (!confirm('¿Está seguro de que desea eliminar este grupo? Esta acción eliminará todos los miembros y gastos.')) {
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch('/api/groups', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombres: [grupoNombre] }),
      });

      if (!respuesta.ok) {
        const datos = await respuesta.json();
        throw new Error(datos.error || 'Error al eliminar el grupo');
      }

      // Redirigir a la página principal
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el grupo');
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [grupoNombre]);

  if (cargando) {
    return (
      <>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.loading}>Cargando grupo...</div>
        </div>
      </>
    );
  }

  if (error || !grupo) {
    return (
      <>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.error}>{error || 'Grupo no encontrado'}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1>📊 {grupo.nombre}</h1>
            <button
              onClick={manejarEliminarGrupo}
              className={styles.deleteGroupBtn}
              title="Eliminar grupo"
            >
              🗑️
            </button>
          </div>
          <p className={styles.subtitle}>
            {grupo.miembros.length} miembros • {gastos.length} gastos
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.column}>
            <MembersList members={grupo.miembros} />
            <AddMember grupoNombre={grupoNombre} onMemberAdded={cargarDatos} />
          </div>

          <div className={styles.column}>
            <ExpensesList expenses={gastos} members={grupo.miembros} />
            <AddExpense
              grupoNombre={grupoNombre}
              miembros={grupo.miembros}
              onExpenseAdded={cargarDatos}
            />
          </div>

          <div className={styles.column}>
            <Settlement
              transactions={transacciones}
              balances={saldos}
              members={grupo.miembros}
              totalExpenses={totalGastos}
            />
          </div>
        </div>
      </div>
    </>
  );
}
