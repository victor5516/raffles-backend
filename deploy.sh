#!/bin/bash

# Script de Despliegue para EC2 con PM2
# Uso: ./deploy.sh

set -e

echo "🚀 Iniciando despliegue de Raffle Backend..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

# Verificar si existe el archivo .env
if [ ! -f ".env" ]; then
    print_warning "No se encontró archivo .env. Asegúrate de configurar las variables de entorno."
fi

# Crear directorio de logs si no existe
mkdir -p logs

print_status "Instalando dependencias..."
npm ci --only=production

print_status "Generando cliente de Prisma..."
npm run prisma:generate

print_status "Ejecutando migraciones de producción..."
npm run prisma:deploy

print_status "Compilando aplicación..."
npm run build

print_status "Deteniendo aplicación anterior (si existe)..."
pm2 stop raffle-backend 2>/dev/null || true
pm2 delete raffle-backend 2>/dev/null || true

print_status "Iniciando aplicación con PM2..."
npm run pm2:start

print_status "Configurando PM2 para iniciar automáticamente..."
pm2 startup
pm2 save

print_status "Verificando estado de la aplicación..."
sleep 3
pm2 status

print_status "Mostrando logs recientes..."
pm2 logs raffle-backend --lines 10

echo ""
print_status "✅ Despliegue completado exitosamente!"
echo ""
echo "Comandos útiles:"
echo "  - Ver logs: npm run pm2:logs"
echo "  - Monitorear: npm run pm2:monit"
echo "  - Reiniciar: npm run pm2:restart"
echo "  - Detener: npm run pm2:stop"
echo ""
