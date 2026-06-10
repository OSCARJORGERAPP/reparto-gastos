# Script para iniciar el desarrollo en Windows
# Requiere Docker Desktop ejecutándose

Write-Host "🚀 Iniciando Reparto Gastos..." -ForegroundColor Green

# Verificar si Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Descargalo desde: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Verificar si Docker está corriendo
try {
    docker info > $null 2>&1
} catch {
    Write-Host "❌ Docker no está corriendo" -ForegroundColor Red
    Write-Host "Por favor inicia Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Iniciar MongoDB
Write-Host "📦 Iniciando MongoDB..." -ForegroundColor Cyan
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al iniciar MongoDB" -ForegroundColor Red
    exit 1
}

Write-Host "✅ MongoDB iniciado correctamente" -ForegroundColor Green

# Esperar a que MongoDB esté listo
Write-Host "⏳ Esperando a que MongoDB esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Iniciar la aplicación
Write-Host "🌐 Iniciando aplicación..." -ForegroundColor Cyan
npm run dev

Write-Host "✨ ¡Aplicación iniciada!" -ForegroundColor Green
Write-Host "Abre http://localhost:3000 en tu navegador" -ForegroundColor Yellow
