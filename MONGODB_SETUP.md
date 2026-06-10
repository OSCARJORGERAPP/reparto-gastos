# Setup de MongoDB Local

Este proyecto está configurado para trabajar con MongoDB de forma local usando Docker.

## Requisitos Previos

- **Docker Desktop** instalado y ejecutándose
- **Docker Compose** (incluido en Docker Desktop)
- O bien, **MongoDB Community Edition** instalado directamente

## Opción 1: Usando Docker (Recomendado)

### Paso 1: Iniciar MongoDB con Docker Compose

```bash
docker-compose up -d
```

Este comando:
- Descarga la imagen de MongoDB 7.0
- Inicia un contenedor llamado `reparto-gastos-db`
- Expone MongoDB en `localhost:27017`
- Crea las colecciones e índices automáticamente
- Persiste los datos en un volumen

### Paso 2: Verificar que MongoDB está corriendo

```bash
docker-compose ps
```

Deberías ver el contenedor `reparto-gastos-db` con estado `healthy`.

### Paso 3: Conectar desde la aplicación

El archivo `.env.local` ya está configurado con:
```
MONGODB_URI=mongodb://localhost:27017/reparto-gastos
```

### Detener MongoDB

```bash
docker-compose down
```

### Detener y eliminar datos

```bash
docker-compose down -v
```

---

## Opción 2: Usando MongoDB Community Edition (Local)

### Paso 1: Instalar MongoDB Community

**Windows:**
1. Descarga el instalador desde [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Ejecuta el instalador
3. Acepta la instalación del servicio de Windows

**macOS (con Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt-get update
apt-get install -y mongodb-org
systemctl start mongod
```

### Paso 2: Crear la base de datos e índices

Abre una terminal y ejecuta:

```bash
mongosh
```

Luego, en la consola de MongoDB:

```javascript
// Cambiar a la base de datos
use reparto-gastos

// Crear colecciones con índices
db.createCollection('groups')
db.groups.createIndex({ name: 1 }, { unique: true })

db.createCollection('expenses')
db.expenses.createIndex({ groupId: 1 })
db.expenses.createIndex({ groupId: 1, createdAt: -1 })

db.createCollection('users')
db.users.createIndex({ groupId: 1 })
```

### Paso 3: Verificar la conexión

El archivo `.env.local` ya está configurado. La aplicación debería conectarse automáticamente.

---

## Verificar la Conexión desde la Aplicación

Ejecuta la aplicación:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador. Si la aplicación inicia sin errores de conexión, ¡MongoDB está configurado correctamente!

---

## Herramientas para Inspeccionar MongoDB

### MongoDB Compass

Herramienta gráfica oficial para inspeccionar MongoDB:

1. Descarga desde [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
2. Instala y abre
3. Conecta a `mongodb://localhost:27017`
4. Verifica que exista la base de datos `reparto-gastos`

### mongosh (CLI)

```bash
# Conectar
mongosh

# Ver bases de datos
show databases

# Cambiar a reparto-gastos
use reparto-gastos

# Ver colecciones
show collections

# Ver documentos en groups
db.groups.find()
```

---

## Solución de Problemas

### Error: "connect ECONNREFUSED 127.0.0.1:27017"

**Soluciones:**
1. Verifica que MongoDB está corriendo: `docker-compose ps`
2. Si usas Docker, inicia con: `docker-compose up -d`
3. Si usas instalación local, verifica que el servicio está corriendo
4. Reinicia Docker Desktop

### Error: "duplicate key error" para "name"

Significa que ya existe un grupo con ese nombre. MongoDB está funcionando correctamente.

### Contenedor no inicia

```bash
# Ver logs
docker-compose logs mongodb

# Reiniciar
docker-compose restart
```

---

## Desarrollo Recomendado

1. **Inicio del día:**
   ```bash
   docker-compose up -d
   npm run dev
   ```

2. **Inspeccionar datos:**
   ```bash
   docker exec -it reparto-gastos-db mongosh
   ```

3. **Reiniciar base de datos (eliminar datos):**
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

4. **Al terminar (opcional):**
   ```bash
   docker-compose down
   ```

---

## Conexión desde Tests

Para tests, usa la misma URI:
```
MONGODB_URI=mongodb://localhost:27017/reparto-gastos
```

O con variables de entorno para tests:
```
MONGODB_URI=mongodb://localhost:27017/reparto-gastos-test
```
