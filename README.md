# Reparto Gastos

Una aplicación de reparto de gastos en tiempo real construida con Next.js y MongoDB.

## Características

- ✨ **Gestión de grupos**: Crea grupos y accede a ellos por nombre
- 👥 **Administración de miembros**: Agrega y gestiona miembros en cada grupo
- 💰 **Seguimiento de gastos**: Registra gastos con importe y descripción
- 🔄 **Liquidación en tiempo real**: Cálculo automático de deudas actualizadas en tiempo real
- 📊 **Saldos actualizados**: Ve quién le debe a quién en cada momento

## Stack Tecnológico

- **Frontend**: Next.js (React 18)
- **Backend**: API Routes de Next.js
- **Base de Datos**: MongoDB (driver nativo)
- **Lenguaje**: TypeScript

## Instalación

### Requisitos previos

- Node.js 18+ y npm/yarn
- MongoDB Atlas (o MongoDB local)

### Pasos de instalación

1. **Clona el repositorio**
   ```bash
   git clone <repositorio>
   cd reparto-gastos
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configura MongoDB**
   
   El proyecto ya viene con `.env.local` configurado para MongoDB local.
   
   **Opción A: Usando Docker (Recomendado)**
   ```bash
   docker-compose up -d
   ```
   
   **Opción B: Instalación local**
   
   Ver [MONGODB_SETUP.md](./MONGODB_SETUP.md) para instrucciones detalladas.

4. **Ejecuta la aplicación en desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```
   
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Inicio Rápido (Windows)
   ```bash
   .\scripts\dev.ps1
   ```

### Inicio Rápido (macOS/Linux)
   ```bash
   chmod +x scripts/dev.sh
   ./scripts/dev.sh
   ```

5. **Opcional: Cargar datos iniciales (Seed)**
   
   Para llenar la base de datos con datos de ejemplo:
   ```bash
   npm run db:seed
   ```
   
   Esto crea:
   - 2 grupos de ejemplo ("Viaje a París", "Cena de Amigos")
   - 7 usuarios en total
   - 7 gastos distribuidos
   - Liquidaciones automáticas

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta el linter |
| `npm run format` | Formatea el código con Prettier |
| `npm run db:start` | Inicia MongoDB con Docker |
| `npm run db:stop` | Detiene MongoDB |
| `npm run db:reset` | Reinicia MongoDB (elimina datos) |
| `npm run db:verify` | Verifica conexión a MongoDB |
| `npm run db:seed` | Carga datos iniciales de ejemplo |
| `npm run db:logs` | Ver logs de MongoDB en tiempo real |

## Estructura del Proyecto

```
src/
├── app/                    # Ruteador de Next.js
│   ├── api/               # Rutas API
│   │   ├── groups/        # Operaciones CRUD de grupos
│   │   ├── expenses/      # Gestión de gastos
│   │   └── settlement/    # Cálculos de liquidación
│   ├── groups/            # Páginas de grupos
│   ├── layout.tsx         # Layout raíz
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React reutilizables
├── lib/                   # Utilidades y helpers
│   ├── mongodb.ts         # Conexión a MongoDB
│   ├── settlement.ts      # Lógica de liquidación
│   └── validation.ts      # Validación de entrada
├── types/                 # Definiciones de tipos TypeScript
└── middleware.ts          # Middleware (autenticación, etc.)
```

## Colecciones de MongoDB

### groups
```javascript
{
  _id: ObjectId,
  name: String (único),
  members: [{ userId, name, joinedAt }],
  createdAt: Date,
  updatedAt: Date
}
```

### expenses
```javascript
{
  _id: ObjectId,
  groupId: ObjectId,
  paidBy: UserId,
  amount: Number,
  description: String,
  participants: [UserId],
  createdAt: Date
}
```

### users
```javascript
{
  _id: ObjectId,
  groupId: ObjectId,
  name: String,
  createdAt: Date
}
```

## Desarrollo

Para más información sobre la arquitectura y convenciones de desarrollo, consulta [AGENTS.md](./AGENTS.md).

### Crear una nueva característica

1. Define los tipos en `src/types/`
2. Crea/actualiza la ruta API en `src/app/api/`
3. Construye el componente en `src/components/`
4. Si afecta la liquidación, desencadena actualización en tiempo real

### Testing

- **Pruebas unitarias**: Algoritmo de liquidación
- **Pruebas API**: CRUD de grupos y gastos
- **Pruebas de integración**: Flujos completos
- **Pruebas E2E**: Trayectorias de usuario

## Seguridad

- ✅ Validación en cliente y servidor
- ✅ Autorización de grupo
- ✅ Sanitización de entrada
- ✅ Rate limiting recomendado

## Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/MiCaracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega MiCaracteristica'`)
4. Push a la rama (`git push origin feature/MiCaracteristica`)
5. Abre un Pull Request

## Licencia

MIT

## Soporte

Si tienes preguntas o encuentras problemas, abre un issue en el repositorio.
