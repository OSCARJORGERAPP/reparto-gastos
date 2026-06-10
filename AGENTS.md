# Reparto Gastos - Guía para Agentes de IA

## Descripción del Proyecto

**Reparto Gastos** es una aplicación de reparto de gastos en tiempo real construida con Next.js y MongoDB. Los usuarios organizan el seguimiento de gastos dentro de grupos nombrados, agregan miembros, registran gastos y liquidan deudas automáticamente en tiempo real.

### Stack Tecnológico
- **Frontend**: Next.js (React)
- **Backend**: Rutas API de Next.js
- **Base de Datos**: MongoDB (driver nativo, sin ORM)
- **Tiempo Real**: WebSockets o Server-Sent Events (SSE)

### Características Principales
1. **Gestión de Grupos**: Crear grupos, acceder por nombre, agregar miembros
2. **Seguimiento de Gastos**: Los miembros registran gastos con importe y descripción
3. **Liquidación en Tiempo Real**: Cálculo automático de deudas y actualización de liquidación en tiempo real
4. **Seguimiento de Saldos**: Ver quién le debe a quién en cada momento

---

## Arquitectura y Convenciones

### Estructura de Carpetas

```
src/
  ├── app/                  # Ruteador de Next.js
  │   ├── api/              # Rutas API
  │   │   ├── groups/       # Operaciones CRUD de grupos
  │   │   ├── expenses/     # Gestión de gastos
  │   │   ├── settlement/   # Cálculos de liquidación
  │   │   └── ws/           # Endpoint de WebSocket (si se usa)
  │   ├── groups/           # Páginas de grupos
  │   ├── layout.tsx        # Layout raíz
  │   └── page.tsx          # Página de inicio
  ├── components/           # Componentes React reutilizables
  ├── lib/                  # Utilidades y helpers
  │   ├── mongodb.ts        # Conexión y pool de MongoDB
  │   ├── settlement.ts     # Lógica de cálculo de liquidación
  │   └── validation.ts     # Validación de entrada
  ├── types/                # Definiciones de tipos TypeScript
  └── middleware.ts         # Autenticación/autorización
```

### Colecciones de MongoDB

```
groups: {
  _id: ObjectId,
  name: String (único),
  members: [{ userId, name, joinedAt }],
  createdAt: Date,
  updatedAt: Date
}

expenses: {
  _id: ObjectId,
  groupId: ObjectId,
  paidBy: UserId,
  amount: Number,
  description: String,
  participants: [UserId],
  createdAt: Date
}

users: {
  _id: ObjectId,
  groupId: ObjectId,
  name: String,
  createdAt: Date
}
```

### Patrones Clave

1. **Driver Nativo de MongoDB**: Usar `MongoClient` con pool de conexiones. La conexión debe establecerse una única vez y reutilizarse. Ver `lib/mongodb.ts` para el patrón singleton.

2. **Actualizaciones en Tiempo Real**: Usar Server-Sent Events (SSE) para actualizaciones de liquidación en tiempo real. Difundir a todos los miembros del grupo cuando se agreguen/modifiquen gastos.

3. **Algoritmo de Liquidación**: 
   - Calcular quién le debe a quién usando enfoque basado en gráfos
   - Simplificar liquidaciones para minimizar cantidad de transacciones
   - Actualizar saldo en tiempo real cuando cambian los gastos

4. **Acceso a Grupos**: Los grupos se identifican por `name` (no solo por ID). Implementar búsqueda insensible a mayúsculas/minúsculas.

5. **Validación**: Validar tanto en cliente como en servidor. Validación de entrada en `lib/validation.ts`.

---

## Flujo de Desarrollo

### Configuración e Instalación

```bash
npm install
# o
yarn install
```

### Variables de Entorno

Crear `.env.local`:
```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/reparto-gastos?retryWrites=true&w=majority
NODE_ENV=development
```

### Ejecutar Localmente

```bash
npm run dev
# Visitar http://localhost:3000
```

### Compilar para Producción

```bash
npm run build
npm start
```

---

## Tareas Comunes de Desarrollo

### Agregar una Nueva Característica

1. **Definir Tipos**: Agregar interfaces TypeScript a `src/types/`
2. **Esquema de Base de Datos**: Actualizar documentos de colecciones de MongoDB, crear índices si es necesario
3. **Ruta API**: Crear nuevo endpoint en `src/app/api/`
4. **Componente**: Construir componente UI en `src/components/`
5. **Tiempo Real**: Si afecta liquidación, desencadenar difusión SSE

### Lógica de Liquidación en Tiempo Real

Cuando se agrega/modifica/elimina un gasto:
1. Recalcular liquidación para el grupo
2. Determinar lista mínima de transferencias necesarias
3. Difundir a todos los clientes conectados vía SSE
4. Actualizar UI en tiempo real

### Reglas de Validación de Gastos

- El importe del gasto debe ser > 0
- La descripción es requerida
- Todos los participantes deben ser miembros del grupo
- Una persona no puede pagar y también ser participante (o aclarar esta regla)

---

## Consideraciones Importantes

### Rendimiento

- **Pool de Conexiones**: La conexión de MongoDB debe usar pooling. Configurar `maxPoolSize` en la cadena de conexión.
- **Índices**: Crear índices en campos frecuentemente consultados:
  - `groups.name` (único)
  - `expenses.groupId` y `expenses.createdAt`
  - `users.groupId`
- **Límites de Tiempo Real**: SSE tiene límites de conexión. Considerar limitar conexiones concurrentes por grupo.

### Seguridad

- Validar pertenencia al grupo antes de permitir modificaciones de gastos
- Sanitizar nombres de grupo y entrada de usuario
- Usar CORS correctamente si frontend y backend están separados
- Implementar limitación de velocidad en endpoints API
- Autenticar usuarios (implementar gestión de sesión o JWT)

### Precisión de Liquidación

- Usar aritmética decimal (Prisma Decimal o similar) para evitar errores de punto flotante
- Probar algoritmo de liquidación con escenarios complejos de múltiples miembros
- Documentar claramente la fórmula de liquidación

---

## Pruebas

Cobertura de pruebas sugerida:

- **Pruebas Unitarias**: Algoritmo de cálculo de liquidación
- **Pruebas API**: CRUD de grupos, gestión de gastos, autorización
- **Pruebas de Integración**: Flujo completo de gasto → cálculo de liquidación → difusión en tiempo real
- **Pruebas E2E**: Trayectoria del usuario desde crear grupo hasta liquidar gastos

---

## Comandos y Patrones Útiles

| Tarea | Comando/Patrón |
|------|---|
| Formatear código | `npm run format` (si está configurado) |
| Linting | `npm run lint` |
| Verificación de tipos | `tsc --noEmit` |
| Ver MongoDB | Usar MongoDB Compass o Atlas UI |
| Depurar API | Usar Chrome DevTools o depurador de VS Code |

---

## Próximos Pasos para Agentes de IA

Al trabajar en este proyecto:

1. **Siempre respeta tipos TypeScript** - Define tipos apropiados antes de implementar características
2. **Usa pipelines de agregación de MongoDB** para consultas complejas de liquidación
3. **Implementa manejo de errores adecuado** con mensajes significativos
4. **Prueba el algoritmo de liquidación** exhaustivamente con casos extremos
5. **Documenta el flujo de datos en tiempo real** cuando agregues endpoints SSE o WebSocket
6. **Considera adiciones concurrentes de gastos** - la liquidación debe ser idempotente

---

## Seed de Datos

Para facilitar el desarrollo y las pruebas, el proyecto incluye un script de seed que crea datos de ejemplo automáticamente.

### Ejecutar el seed

```bash
npm run db:seed
```

### Qué crea el seed

**Grupos:**
- "Viaje a París" - 3 miembros, 4 gastos
- "Cena de Amigos" - 4 miembros, 3 gastos

**Usuarios:**
- Ana, Bruno, Carlos (Viaje a París)
- Diana, Enrique, Fernanda, Gastón (Cena de Amigos)

**Gastos:**
- Hotel, comidas, transporte, entretenimiento
- Montos variados para ver liquidación realista

### Limpiar y recargar seed

```bash
npm run db:reset
npm run db:seed
```

---

## Habilidades Útiles para Invocar

- `/create-skill` para automatizar cálculos complejos de liquidación
- `@mongodb-natural-language-querying` para consultas complejas de MongoDB
- `@mongodb-query-optimizer` si las consultas de liquidación se vuelven lentas

