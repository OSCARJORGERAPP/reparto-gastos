# 🚀 Inicio Rápido

## En Windows

```powershell
# Paso 1: Inicia MongoDB
docker-compose up -d

# Paso 2: Carga datos de ejemplo (opcional pero recomendado)
npm run db:seed

# Paso 3: Inicia la aplicación
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000)

---

## En macOS/Linux

```bash
# Paso 1: Inicia MongoDB
docker-compose up -d

# Paso 2: Carga datos de ejemplo (opcional pero recomendado)
npm run db:seed

# Paso 3: Inicia la aplicación
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000)

---

## Usando los scripts de inicio

### Windows
```powershell
.\scripts\dev.ps1
```

### macOS/Linux
```bash
chmod +x scripts/dev.sh
./scripts/dev.sh
```

---

## Comandos Útiles

```bash
# Verificar que MongoDB está conectado
npm run db:verify

# Cargar datos de ejemplo
npm run db:seed

# Reiniciar la base de datos (elimina todo y vuelve a inicializar)
npm run db:reset

# Ver logs de MongoDB
npm run db:logs

# Detener MongoDB
docker-compose down
```

---

## ¿Problemas?

Ver [MONGODB_SETUP.md](./MONGODB_SETUP.md) para troubleshooting detallado.
