'use client';

import { useState } from 'react';
import styles from './AddMember.module.css';

interface AddMemberProps {
  grupoNombre: string;
  onMemberAdded: () => void;
}

export function AddMember({ grupoNombre, onMemberAdded }: AddMemberProps) {
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarAgregarMiembro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('Por favor ingresa un nombre');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(`/api/groups/${encodeURIComponent(grupoNombre)}/miembros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreMiembro: nombre }),
      });

      if (!respuesta.ok) {
        const datos = await respuesta.json();
        throw new Error(datos.error || 'Error al agregar miembro');
      }

      setNombre('');
      onMemberAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3>Agregar Miembro</h3>
      <form onSubmit={manejarAgregarMiembro}>
        <input
          type="text"
          placeholder="Nombre del miembro"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={cargando}
        />
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" disabled={cargando}>
          {cargando ? 'Agregando...' : 'Agregar'}
        </button>
      </form>
    </div>
  );
}
