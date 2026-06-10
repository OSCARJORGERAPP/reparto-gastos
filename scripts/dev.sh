#!/bin/bash
# Script para iniciar el desarrollo en macOS/Linux
# Requiere Docker y Docker Compose

echo "🚀 Iniciando Reparto Gastos..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    echo "Descargalo desde: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo"
    echo "Por favor inicia Docker Desktop"
    exit 1
fi

# Iniciar MongoDB
echo "📦 Iniciando MongoDB..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Error al iniciar MongoDB"
    exit 1
fi

echo "✅ MongoDB iniciado correctamente"

# Esperar a que MongoDB esté listo
echo "⏳ Esperando a que MongoDB esté listo..."
sleep 3

# Iniciar la aplicación
echo "🌐 Iniciando aplicación..."
npm run dev

echo "✨ ¡Aplicación iniciada!"
echo "Abre http://localhost:3000 en tu navegador"
