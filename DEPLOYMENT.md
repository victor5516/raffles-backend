# Guía de Despliegue - Raffle Backend

## Scripts Disponibles

### Desarrollo
- `npm run dev` - Ejecuta la aplicación en modo desarrollo con nodemon
- `npm run prisma:migrate` - Ejecuta las migraciones de desarrollo

### Build y Producción
- `npm run build` - Compila TypeScript a JavaScript
- `npm run build:clean` - Limpia la carpeta dist y recompila
- `npm run start` - Ejecuta la aplicación compilada
- `npm run start:prod` - Ejecuta en modo producción

### PM2 (Producción)
- `npm run pm2:start` - Inicia la aplicación con PM2
- `npm run pm2:stop` - Detiene la aplicación
- `npm run pm2:restart` - Reinicia la aplicación
- `npm run pm2:reload` - Recarga la aplicación sin downtime
- `npm run pm2:delete` - Elimina la aplicación de PM2
- `npm run pm2:logs` - Muestra los logs
- `npm run pm2:monit` - Abre el monitor de PM2

### Base de Datos
- `npm run prisma:generate` - Genera el cliente de Prisma
- `npm run prisma:deploy` - Ejecuta las migraciones en producción

### Scripts de Utilidad
- `npm run create:admin` - Crea un administrador
- `npm run create:currencies` - Crea las monedas iniciales
- `npm run update:currency:value` - Actualiza valores de monedas

## Variables de Entorno Requeridas

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/raffles"
DB_NAME=raffles
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3000
NODE_ENV=production

# Optional: Logging
LOG_LEVEL=info
```

## Despliegue en EC2 con PM2

### Prerrequisitos en EC2

1. **Instalar Node.js y npm:**
   ```bash
   # Usar nvm para instalar Node.js
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install 18
   nvm use 18
   ```

2. **Instalar PM2 globalmente:**
   ```bash
   npm install -g pm2
   ```

3. **Instalar PostgreSQL:**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

### Despliegue Automático

**Opción 1: Usando el script de despliegue (Recomendado)**
```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd raffle-backend

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Ejecutar script de despliegue
./deploy.sh
```

**Opción 2: Despliegue manual**
```bash
# 1. Instalar dependencias
npm ci --only=production

# 2. Generar cliente de Prisma
npm run prisma:generate

# 3. Ejecutar migraciones
npm run prisma:deploy

# 4. Compilar aplicación
npm run build

# 5. Iniciar con PM2
npm run pm2:start

# 6. Configurar inicio automático
pm2 startup
pm2 save
```

### Gestión de la Aplicación

```bash
# Ver estado de la aplicación
pm2 status

# Ver logs en tiempo real
npm run pm2:logs

# Monitorear recursos
npm run pm2:monit

# Reiniciar aplicación
npm run pm2:restart

# Detener aplicación
npm run pm2:stop

# Eliminar aplicación de PM2
npm run pm2:delete
```

### Configuración de Nginx (Opcional)

Si quieres usar Nginx como proxy reverso:

1. **Instalar Nginx:**
   ```bash
   sudo apt install nginx
   ```

2. **Crear configuración:**
   ```bash
   sudo nano /etc/nginx/sites-available/raffle-backend
   ```

3. **Contenido de la configuración:**
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Habilitar el sitio:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/raffle-backend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Configuración de Firewall

```bash
# Abrir puertos necesarios
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP (si usas Nginx)
sudo ufw allow 443   # HTTPS (si usas SSL)
sudo ufw enable
```

## Despliegue con Docker (Alternativo)

### Usando Docker Compose
```bash
# Construir y ejecutar
docker-compose up --build

# Ejecutar en background
docker-compose up -d --build

# Detener servicios
docker-compose down
```

### Usando Docker directamente
```bash
# Construir imagen
docker build -t raffle-backend .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env raffle-backend
```

## Despliegue Manual

1. **Instalar dependencias:**
   ```bash
   npm ci --only=production
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tus valores
   ```

3. **Generar cliente de Prisma:**
   ```bash
   npm run prisma:generate
   ```

4. **Ejecutar migraciones:**
   ```bash
   npm run prisma:deploy
   ```

5. **Compilar la aplicación:**
   ```bash
   npm run build
   ```

6. **Ejecutar en producción:**
   ```bash
   npm run start:prod
   ```

## Notas Importantes

- Asegúrate de que la base de datos PostgreSQL esté configurada y accesible
- El puerto por defecto es 3000, pero puede ser configurado con la variable PORT
- En producción, siempre usa NODE_ENV=production
- El JWT_SECRET debe ser una cadena segura y única
- Las migraciones de Prisma deben ejecutarse antes de iniciar la aplicación
- PM2 mantendrá la aplicación corriendo y la reiniciará automáticamente si se cae
- Los logs se guardan en la carpeta `logs/` para facilitar el debugging
- Considera usar un certificado SSL para HTTPS en producción
