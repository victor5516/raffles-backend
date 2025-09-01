#!/bin/bash

# Script de Actualización para EC2 con PM2
# Uso: ./update.sh

set -e

echo "🔄 Iniciando actualización de Raffle Backend..."

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

print_status "Obteniendo cambios del repositorio..."
git pull origin main

print_status "Instalando dependencias..."
npm ci --only=production

print_status "Generando cliente de Prisma..."
npm run prisma:generate

print_status "Ejecutando migraciones..."
npm run prisma:deploy

print_status "Compilando aplicación..."
npm run build

print_status "Recargando aplicación con PM2..."
npm run pm2:reload

print_status "Verificando estado de la aplicación..."
sleep 3
pm2 status

print_status "Mostrando logs recientes..."
pm2 logs raffle-backend --lines 10

echo ""
print_status "✅ Actualización completada exitosamente!"
echo ""
