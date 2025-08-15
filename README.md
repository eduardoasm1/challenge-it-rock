# Challenge IT Rock - Backend API

Una aplicación backend desarrollada con NestJS que proporciona endpoints funcionales, eficientes.

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Arquitectura](#-arquitectura)
- [Módulos](#-módulos)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#-base-de-datos)
- [Docker](#-docker)
- [Scripts Disponibles](#-scripts-disponibles)

## 🛠 Documentación

La documentación completa de la API está disponible a través de Swagger UI una vez que la aplicación esté ejecutándose:

**URL de Documentación:** `http://localhost:3000/docs`

> 📝 **Nota:** La documentación incluye todos los endpoints disponibles, esquemas de datos, ejemplos de requests/responses y permite probar la API directamente desde el navegador.

## 🛠 Tecnologías

- **Framework:** NestJS 11.x
- **Base de Datos:** PostgreSQL con PostGIS (Neon)
- **ORM:** TypeORM
- **Cache:** Redis
- **Autenticación:** JWT
- **Validación:** class-validator, class-transformer
- **Rate Limiting:** @nestjs/throttler
- **Contenedores:** Docker & Docker Compose

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd challenge-it-rock
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (ver sección [Configuración](#-configuración))

## ⚙️ Configuración

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000

# Base de Datos PostgreSQL
DB_HOST=ep-small-wind-ae4h6ft7.c-2.us-east-2.aws.neon.tech
DB_PORT=5432
DB_USER=neondb_owner
DB_PASSWORD=npg_8yhekwNsO9GC
DB_NAME=it-rock

# JWT Configuration
JWT_SECRET=it-rock-secret
JWT_SECRET_EXPIRES_IN=15m
JWT_REFRESH_SECRET=it-rock-refresh-secret
JWT_REFRESH_SECRET_EXPIRES_IN=7d

# APIs Externas
JSON_PLACEHOLDER_API_KEY=miclavedeapijsonplaceholder
JSON_PLACEHOLDER_BASE_API_URL=https://jsonplaceholder.typicode.com

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Usuario Administrador

Para acceder a endpoints protegidos, utilizar las siguientes credenciales:

```json
{
  "username": "admin",
  "password": "password"
}
```

## 🚀 Ejecución

### Desarrollo Local

```bash
# Modo desarrollo con hot-reload
npm run start:dev

# Modo debug
npm run start:debug
```

La aplicación estará disponible en `http://localhost:3000`

### Producción

```bash
# Construir la aplicación
npm run build

# Ejecutar en producción
npm run start:prod
```

### Con Docker

```bash
# Ejecutar con Docker Compose (incluye Redis)
docker-compose up -d

# Solo construir la imagen
docker build -t challenge-it-rock .
```

## 🏗 Arquitectura

### Arquitectura Modular

La aplicación implementa una **arquitectura modular** basada en NestJS donde cada funcionalidad tiene su propio módulo:

```
src/
├── auth/              # Autenticación y autorización
├── user/              # Gestión de usuarios
├── task/              # Gestión de tareas
├── refresh-token/     # Tokens de actualización
├── json-placeholder/  # Integración con API externa
├── notifications/     # Sistema de notificaciones
├── redis/             # Configuración de Redis
├── common/            # Utilidades compartidas
└── types/             # Definiciones de tipos
```

### Características Principales

- **Inyección de Dependencias** nativa de NestJS
- **Decoradores** para validación y transformación
- **Guards** para protección de rutas
- **Interceptores** para cache y logging
- **Pipes** para validación de datos
- **Filters** para manejo de excepciones

## 📚 Módulos

### **AuthModule**
- Autenticación JWT
- Login/Register endpoints
- Password hashing con bcrypt

### **UserModule**
- CRUD de usuarios
- Perfiles de usuario
- Relaciones con tareas

### **TaskModule**
- Gestión completa de tareas
- Prioridades (LOW, MEDIUM, HIGH)
- Propiedad para Soft delete con campo `active`
- Relación con usuarios

### **JsonPlaceholderModule**
- Integración con JSONPlaceholder API
- Cache de respuestas
- Manejo de errores

### **NotificationsModule**
- Sistema de eventos
- Listeners para acciones
- Notificaciones en tiempo real

### **RedisModule**
- Configuración de cache
- Gestión de sesiones
- Rate limiting

## 🔌 API Endpoints

### Autenticación
```
POST /auth/login       # Iniciar sesión
POST /auth/register    # Registrar usuario
POST /auth/refresh     # Renovar token
```

### Tareas
```
GET    /tasks          # Listar tareas
POST   /tasks          # Crear tarea
GET    /tasks/:id      # Obtener tarea
PUT    /tasks/:id      # Actualizar tarea
DELETE /tasks/:id      # Eliminar tarea (soft delete)
GET    /tasks/populate # Popular tareas (aqui es necesario guardar el header "x-api-key" para autenticacion del servicio de tercero, value = miclavedeapijsonplaceholder)
```
## 🗄️ Base de Datos

### Entidades Principales

**User Entity:**
- id (UUID)
- email (unique)
- password (hashed)
- name
- active (soft delete)
- timestamps

**Task Entity:**
- id (UUID)
- title
- description
- completed (boolean)
- priority (enum: LOW, MEDIUM, HIGH)
- user (relation)
- active (soft delete)
- timestamps

**RefreshToken Entity:**
- id (UUID)
- token
- user (relation)
- expiresAt
- timestamps

### Características de BD

- **PostgreSQL** con SSL habilitado
- **Soft Delete** en todas las entidades principales
- **Índices optimizados** para consultas frecuentes
- **Relaciones** bien definidas con TypeORM
- **Timestamps** automáticos (createdAt, updatedAt)

## 🐳 Docker

### Docker Compose

El proyecto incluye configuración completa con:

- **App Container:** Aplicación NestJS
- **Redis Container:** Cache y sesiones
- **Health Checks:** Para todos los servicios
- **Volumes:** Persistencia de datos Redis

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    depends_on:
      - redis
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev      # Modo desarrollo con hot-reload
npm run start:debug    # Modo debug con inspector

# Producción
npm run build          # Construir aplicación
npm run start:prod     # Ejecutar en producción

# Calidad de Código
npm run lint           # ESLint
npm run format         # Prettier
```

## 🔧 Decisiones Técnicas

### **Performance**
- **Rate Limiting:** 10 requests por minuto por IP
- **Cache Redis:** Para consultas frecuentes
- **Consultas optimizadas:** TypeORM con lazy loading
- **Paginación:** En endpoints que retornan listas

### **Seguridad**
- **JWT Tokens:** Con refresh token rotation
- **Password Hashing:** bcrypt con salt rounds
- **CORS:** Configurado para producción
- **Validation Pipes:** En todos los endpoints

### **Escalabilidad**
- **Arquitectura modular:** Fácil mantenimiento
- **Event-driven:** Sistema de notificaciones
- **Docker ready:** Para deployment
- **Environment configs:** Separación de entornos

1. **Build automático** desde repositorio
2. **Variables de entorno** configuradas
3. **Base de datos externa** (Neon PostgreSQL)
4. **Redis externo** para cache
5. **SSL/HTTPS** habilitado

---

**Desarrollado por:** Eduardo Sequeira  
**Versión:** 0.0.1  
**Licencia:** UNLICENSED
