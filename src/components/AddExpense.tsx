'use client';

import { useState } from 'react';
import { Miembro } from '@/types';
import styles from './AddExpense.module.css';

interface AddExpenseProps {
  grupoNombre: string;
  miembros: Miembro[];
  onExpenseAdded: () => void;
}

export function AddExpense({ grupoNombre, miembros, onExpenseAdded }: AddExpenseProps) {
  const [monto, setMonto] = useState('');
  const [descripción, setDescripción] = useState('');
  const [pagadoPor, setPagadoPor] = useState('');
  const [participantes, setParticipantes] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarAgregarGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!monto || parseFloat(monto) <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    if (!descripción.trim()) {
      setError('La descripción es requerida');
      return;
    }

    if (!pagadoPor) {
      setError('Por favor selecciona quién pagó');
      return;
    }

    if (participantes.length === 0) {
      setError('Selecciona al menos un participante');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(`/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grupoNombre,
          monto: parseFloat(monto),
          descripción,
          pagadoPor,
          participantes,
        }),
      });

      if (!respuesta.ok) {
        const datos = await respuesta.json();
        throw new Error(datos.error || 'Error al agregar gasto');
      }

      setMonto('');
      setDescripción('');
      setPagadoPor('');
      setParticipantes([]);
      onExpenseAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  const manejarParticipante = (userId: string) => {
    setParticipantes((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const seleccionarTodos = () => {
    setParticipantes(miembros.map((m) => m.userId));
  };

  const deseleccionarTodos = () => {
    setParticipantes([]);
  };

  return (
    <div className={styles.container}>
      <h3>Registrar Gasto</h3>
      <form onSubmit={manejarAgregarGasto}>
        <div className={styles.formGroup}>
          <label htmlFor="monto">Monto ($)</label>
          <input
            type="number"
            id="monto"
            placeholder="0.00"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            disabled={cargando}
            step="0.01"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="descripción">Descripción</label>
          <input
            type="text"
            id="descripción"
            placeholder="ej: Comida en restaurante"
            value={descripción}
            onChange={(e) => setDescripción(e.target.value)}
            disabled={cargando}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pagadoPor">¿Quién pagó?</label>
          <select
            id="pagadoPor"
            value={pagadoPor}
            onChange={(e) => setPagadoPor(e.target.value)}
            disabled={cargando}
          >
            <option value="">Selecciona un miembro</option>
            {miembros.map((miembro) => (
              <option key={miembro.userId} value={miembro.userId}>
                {miembro.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>¿Quiénes participan?</label>
          <div className={styles.buttons}>
            <button type="button" onClick={seleccionarTodos} className={styles.selectBtn}>
              Todos
            </button>
            <button type="button" onClick={deseleccionarTodos} className={styles.selectBtn}>
              Ninguno
            </button>
          </div>
          <div className={styles.checkboxes}>
            {miembros.map((miembro) => (
              <label key={miembro.userId} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={participantes.includes(miembro.userId)}
                  onChange={() => manejarParticipante(miembro.userId)}
                  disabled={cargando}
                />
                {miembro.nombre}
              </label>
            ))}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" disabled={cargando} className={styles.submit}>
          {cargando ? 'Registrando...' : 'Registrar Gasto'}
        </button>
      </form>
    </div>
  );
}
