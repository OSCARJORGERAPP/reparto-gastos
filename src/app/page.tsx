'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import Link from 'next/link';
import { Grupo } from '@/types';
import styles from './page.module.css';

export default function Home() {
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [gruposRecientes, setGruposRecientes] = useState<Grupo[]>([]);
  const [cargandoGrupos, setCargandoGrupos] = useState(true);
  const [gruposSeleccionados, setGruposSeleccionados] = useState<Set<string>>(
    new Set()
  );
  const [eliminando, setEliminando] = useState(false);

  // Cargar todos los grupos de la BD
  useEffect(() => {
    const cargarGrupos = async () => {
      try {
        setCargandoGrupos(true);
        const respuesta = await fetch('/api/groups');
        if (respuesta.ok) {
          const grupos = await respuesta.json();
          setGruposRecientes(grupos);
        }
      } catch (err) {
        console.error('Error al cargar grupos:', err);
      } finally {
        setCargandoGrupos(false);
      }
    };

    cargarGrupos();
  }, []);

  const manejarCrearGrupo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombreGrupo.trim()) {
      setError('Por favor ingresa un nombre para el grupo');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: nombreGrupo }),
      });

      if (!respuesta.ok) {
        const datos = await respuesta.json();
        throw new Error(datos.error || 'Error al crear el grupo');
      }

      const nuevoGrupo = await respuesta.json();

      // Agregar el nuevo grupo a la lista y limpiar el input
      setGruposRecientes([nuevoGrupo, ...gruposRecientes]);
      setNombreGrupo('');

      // Redirigir al grupo creado
      window.location.href = `/groups/${encodeURIComponent(nuevoGrupo.nombre)}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  const manejarSeleccionarGrupo = (nombreGrupo: string) => {
    const nuevaSelección = new Set(gruposSeleccionados);
    if (nuevaSelección.has(nombreGrupo)) {
      nuevaSelección.delete(nombreGrupo);
    } else {
      nuevaSelección.add(nombreGrupo);
    }
    setGruposSeleccionados(nuevaSelección);
  };

  const manejarEliminarGrupos = async () => {
    if (gruposSeleccionados.size === 0) {
      setError('Por favor selecciona al menos un grupo para eliminar');
      return;
    }

    if (
      !confirm(
        `¿Está seguro de que desea eliminar ${gruposSeleccionados.size} grupo(s)? Esta acción eliminará todos los miembros y gastos del grupo.`
      )
    ) {
      return;
    }

    setEliminando(true);
    setError('');

    try {
      const respuesta = await fetch('/api/groups', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombres: Array.from(gruposSeleccionados),
        }),
      });

      if (!respuesta.ok) {
        const datos = await respuesta.json();
        throw new Error(datos.error || 'Error al eliminar los grupos');
      }

      // Actualizar la lista de grupos
      const gruposActualizados = gruposRecientes.filter(
        (g) => !gruposSeleccionados.has(g.nombre)
      );
      setGruposRecientes(gruposActualizados);
      setGruposSeleccionados(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setEliminando(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>💰 Reparto Gastos</h1>
          <p className={styles.subtitle}>
            Comparte gastos con amigos de manera fácil y automática
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <h2>Crear Nuevo Grupo</h2>
            <form onSubmit={manejarCrearGrupo}>
              <div className={styles.inputGroup}>
                <label htmlFor="nombreGrupo">Nombre del Grupo</label>
                <input
                  type="text"
                  id="nombreGrupo"
                  placeholder="ej: Viaje a París, Cena de Amigos"
                  value={nombreGrupo}
                  onChange={(e) => setNombreGrupo(e.target.value)}
                  disabled={cargando}
                  className={styles.input}
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                disabled={cargando}
                className={styles.submitBtn}
              >
                {cargando ? 'Creando...' : 'Crear Grupo'}
              </button>
            </form>

            {gruposRecientes.length > 0 && (
              <div className={styles.gruposRecientes}>
                <div className={styles.gruposHeader}>
                  <h3>Mis Grupos</h3>
                  {gruposSeleccionados.size > 0 && (
                    <button
                      onClick={manejarEliminarGrupos}
                      disabled={eliminando}
                      className={styles.deleteBtn}
                    >
                      {eliminando ? 'Eliminando...' : `🗑️ Eliminar (${gruposSeleccionados.size})`}
                    </button>
                  )}
                </div>
                <div className={styles.gruposBotones}>
                  {gruposRecientes.map((grupo) => (
                    <div key={grupo.nombre} className={styles.grupoItem}>
                      <input
                        type="checkbox"
                        checked={gruposSeleccionados.has(grupo.nombre)}
                        onChange={() => manejarSeleccionarGrupo(grupo.nombre)}
                        className={styles.checkbox}
                      />
                      <Link
                        href={`/groups/${encodeURIComponent(grupo.nombre)}`}
                        className={styles.grupoBoton}
                      >
                        📂 {grupo.nombre}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            <h2>¿Cómo funciona?</h2>
            <div className={styles.steps}>
              <div className={styles.step}>
                <span className={styles.number}>1</span>
                <div>
                  <h4>Crea un grupo</h4>
                  <p>Dale un nombre descriptivo a tu grupo de gastos</p>
                </div>
              </div>

              <div className={styles.step}>
                <span className={styles.number}>2</span>
                <div>
                  <h4>Agrega miembros</h4>
                  <p>Invita a tus amigos por su nombre</p>
                </div>
              </div>

              <div className={styles.step}>
                <span className={styles.number}>3</span>
                <div>
                  <h4>Registra gastos</h4>
                  <p>Añade cada gasto con monto y descripción</p>
                </div>
              </div>

              <div className={styles.step}>
                <span className={styles.number}>4</span>
                <div>
                  <h4>Liquida automático</h4>
                  <p>Mira quién le debe a quién en tiempo real</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.featuresSection}>
            <h2>Características</h2>
            <ul className={styles.features}>
              <li>✨ Interfaz intuitiva y fácil de usar</li>
              <li>🔄 Liquidación automática en tiempo real</li>
              <li>📊 Seguimiento detallado de gastos</li>
              <li>👥 Gestión de múltiples grupos</li>
              <li>💰 Cálculo óptimo de transacciones</li>
              <li>📱 Responsive para móviles y desktop</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
