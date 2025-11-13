# 🚀 Guía de Despliegue en Vercel

Esta guía te mostrará cómo publicar tu aplicación Eventify en Vercel.

## 📋 Requisitos Previos

1. **Cuenta en Vercel**: Crear una cuenta en [vercel.com](https://vercel.com)
2. **Cuenta en MongoDB Atlas**: Base de datos MongoDB en la nube
3. **GitHub/GitLab/Bitbucket**: Repositorio Git con tu código
4. **Node.js**: Versión 16 o superior (Vercel lo maneja automáticamente)

## 🔧 Configuración Inicial

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en un repositorio Git (GitHub, GitLab o Bitbucket):

```bash
git add .
git commit -m "Preparar para despliegue en Vercel"
git push origin main
```

### 2. Archivos Necesarios

Los siguientes archivos ya están configurados en el proyecto:

- ✅ `vercel.json` - Configuración de Vercel
- ✅ `api/index.js` - Punto de entrada para Vercel (serverless function)
- ✅ `package.json` - Dependencias del proyecto
- ✅ `db/mongoose.js` - Manejo optimizado de conexiones MongoDB para serverless

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue desde el Dashboard de Vercel (Recomendado)

1. **Iniciar sesión en Vercel**

   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta de GitHub/GitLab/Bitbucket

2. **Importar Proyecto**

   - Haz clic en "Add New..." → "Project"
   - Selecciona tu repositorio desde la lista
   - Si no aparece, haz clic en "Import Git Repository" y conecta tu cuenta

3. **Configurar el Proyecto**

   - **Framework Preset**: Dejar en blanco o seleccionar "Other"
   - **Root Directory**: Dejar en blanco (raíz del proyecto)
   - **Build Command**: Dejar en blanco (no necesario para Node.js)
   - **Output Directory**: Dejar en blanco
   - **Install Command**: `npm install` (por defecto)

4. **Configurar Variables de Entorno**

   - Haz clic en "Environment Variables"
   - Agrega las siguientes variables:

   ```env
   # Base de datos (REQUERIDO)
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/eventify

   # Autenticación (REQUERIDO)
   JWT_SECRET=tu-secret-key-muy-segura-cambiar-en-produccion
   JWT_EXPIRES_IN=24h
   SESSION_SECRET=tu-session-secret-cambiar-en-produccion

   # Inicialización de administrador (REQUERIDO para crear el primer usuario)
   INIT_ADMIN_SECRET=tu-clave-secreta-para-inicializar-admin

   # Servidor
   NODE_ENV=production
   PORT=3000

   # Email (opcional, para RF2)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=tu-email@gmail.com
   EMAIL_PASS=tu-password-de-aplicacion
   EMAIL_FROM=noreply@eventify.com
   ```

   **⚠️ IMPORTANTE**:

   - `MONGODB_URI` es **OBLIGATORIA** - sin ella la aplicación no funcionará
   - `JWT_SECRET` y `SESSION_SECRET` deben ser cadenas aleatorias seguras (mínimo 32 caracteres)
   - `INIT_ADMIN_SECRET` es necesaria para crear el primer usuario administrador (ver sección "Crear Usuario Administrador Inicial")
   - Puedes generar secretos seguros con: `openssl rand -base64 32`

   **⚠️ IMPORTANTE**: Reemplaza los valores con tus credenciales reales.

5. **Desplegar**
   - Haz clic en "Deploy"
   - Espera a que Vercel construya y despliegue tu aplicación
   - Una vez completado, recibirás una URL (ej: `https://tu-proyecto.vercel.app`)

6. **Crear Usuario Administrador Inicial**
   
   Después del despliegue, necesitas crear el primer usuario administrador. Tienes dos opciones:

   **Opción A: Usando el endpoint de inicialización (Recomendado)**
   
   1. Asegúrate de tener configurada la variable `INIT_ADMIN_SECRET` en Vercel
   2. Visita la siguiente URL en tu navegador (reemplaza `TU_URL` y `TU_SECRET`):
   
      ```
      https://TU_URL.vercel.app/auth/api/init-admin?secret=TU_SECRET
      ```
   
   3. O usa curl/Postman:
   
      ```bash
      curl -X POST https://TU_URL.vercel.app/auth/api/init-admin \
        -H "Content-Type: application/json" \
        -d '{"secret": "TU_SECRET"}'
      ```
   
   4. Si todo sale bien, recibirás las credenciales:
      - **Email:** `admin@eventify.com`
      - **Contraseña:** `admin123`
   
   5. **IMPORTANTE:** Cambia la contraseña después del primer login
   
   **Opción B: Ejecutar el script localmente apuntando a producción**
   
   1. Configura tu `.env` local con la `MONGODB_URI` de producción
   2. Ejecuta: `node scripts/createAdmin.js`
   3. Esto creará el usuario administrador en la base de datos de producción

### Opción 2: Despliegue desde la Línea de Comandos

1. **Instalar Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Iniciar sesión en Vercel**

   ```bash
   vercel login
   ```

3. **Desplegar el Proyecto**

   ```bash
   vercel
   ```

   - Selecciona las opciones por defecto
   - Cuando se te pida configurar variables de entorno, puedes hacerlo ahora o después en el dashboard

4. **Configurar Variables de Entorno**

   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add SESSION_SECRET
   # ... agrega todas las variables necesarias
   ```

5. **Desplegar en Producción**
   ```bash
   vercel --prod
   ```

## 🔐 Configuración de Variables de Entorno

### Variables Requeridas

| Variable            | Descripción                                          | Ejemplo                                                |
| ------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| `MONGODB_URI`       | URI de conexión a MongoDB Atlas                      | `mongodb+srv://user:pass@cluster.mongodb.net/eventify` |
| `JWT_SECRET`        | Clave secreta para JWT                               | `tu-secret-key-muy-segura`                             |
| `SESSION_SECRET`    | Clave secreta para sesiones                          | `tu-session-secret`                                    |
| `INIT_ADMIN_SECRET` | Clave secreta para crear el primer usuario admin     | `tu-clave-secreta-para-inicializar`                    |
| `NODE_ENV`          | Entorno de ejecución                                 | `production`                                           |

### Variables Opcionales

| Variable         | Descripción                  | Ejemplo                |
| ---------------- | ---------------------------- | ---------------------- |
| `JWT_EXPIRES_IN` | Tiempo de expiración del JWT | `24h`                  |
| `PORT`           | Puerto del servidor          | `3000`                 |
| `EMAIL_HOST`     | Servidor SMTP                | `smtp.gmail.com`       |
| `EMAIL_PORT`     | Puerto SMTP                  | `587`                  |
| `EMAIL_USER`     | Usuario de email             | `tu-email@gmail.com`   |
| `EMAIL_PASS`     | Contraseña de email          | `tu-password`          |
| `EMAIL_FROM`     | Email remitente              | `noreply@eventify.com` |

### Cómo Obtener MongoDB URI

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Inicia sesión en tu cuenta
3. Crea un cluster (si no tienes uno)
4. Haz clic en "Connect" → "Connect your application"
5. Copia la URI de conexión
6. Reemplaza `<password>` con tu contraseña de usuario
7. Reemplaza `<dbname>` con `eventify` (o el nombre que prefieras)

## 🌐 Configuración de Dominio Personalizado (Opcional)

1. Ve al dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a "Settings" → "Domains"
4. Agrega tu dominio personalizado
5. Sigue las instrucciones para configurar los DNS

## 🔄 Actualizaciones Automáticas

Vercel se conecta automáticamente a tu repositorio Git y despliega automáticamente cada vez que haces push a la rama principal.

### Configurar Auto-Deploy

1. Ve al dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a "Settings" → "Git"
4. Configura qué ramas activan despliegues
5. Por defecto, `main` o `master` despliega a producción

## 🐛 Solución de Problemas

### Error: "Cannot find module"

**Solución**: Asegúrate de que todas las dependencias estén en `package.json` y que `node_modules` esté en `.gitignore`.

### Error: "MongoDB connection failed"

**Solución**:

1. Verifica que `MONGODB_URI` esté correctamente configurada en Vercel
2. Asegúrate de que tu IP esté en la lista blanca de MongoDB Atlas (o configura acceso desde cualquier IP)
3. Verifica que las credenciales sean correctas

### Error: "Session secret is required"

**Solución**: Asegúrate de configurar `SESSION_SECRET` en las variables de entorno de Vercel.

### La aplicación funciona localmente pero no en Vercel

**Solución**:

1. Revisa los logs de Vercel en el dashboard (Deployments → Functions → Logs)
2. Verifica que todas las variables de entorno estén configuradas (especialmente `MONGODB_URI`)
3. Asegúrate de que `vercel.json` esté correctamente configurado
4. Verifica que `api/index.js` esté en la ubicación correcta
5. Verifica que MongoDB Atlas permita conexiones desde cualquier IP (0.0.0.0/0) o agrega las IPs de Vercel
6. Asegúrate de que el usuario de MongoDB tenga los permisos correctos

### Error: "Cannot find module" o errores de importación

**Solución**:

1. Verifica que `package.json` tenga `"type": "module"` para usar ES modules
2. Asegúrate de que todas las importaciones usen la extensión `.js`
3. Verifica que no haya imports circulares
4. Revisa los logs de build en Vercel para ver qué módulo falta

### Error: "Function execution timeout"

**Solución**:

1. El `vercel.json` ya está configurado con `maxDuration: 30` segundos
2. Si necesitas más tiempo, actualiza el plan de Vercel (el plan gratuito tiene límites)
3. Optimiza las consultas a MongoDB para que sean más rápidas
4. Considera usar índices en MongoDB para mejorar el rendimiento

## 📊 Monitoreo y Logs

### Ver Logs en Vercel

1. Ve al dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a la pestaña "Deployments"
4. Haz clic en un deployment específico
5. Haz clic en "Functions" para ver los logs de las funciones serverless

### Ver Logs en Tiempo Real

```bash
vercel logs
```

## 🔒 Seguridad

### Recomendaciones

1. **Nunca commitees archivos `.env`**: Ya está en `.gitignore`
2. **Usa variables de entorno**: Todas las credenciales deben estar en Vercel
3. **Rotar secretos regularmente**: Cambia `JWT_SECRET` y `SESSION_SECRET` periódicamente
4. **Configura MongoDB Atlas**: Asegúrate de tener acceso restringido por IP o usar autenticación

## 📝 Notas Importantes

### Limitaciones de Vercel

1. **Tiempo de ejecución**: Las funciones serverless tienen un límite de tiempo de ejecución (10 segundos en plan gratuito)
2. **Conexiones MongoDB**: Las conexiones se cachean entre invocaciones para optimizar el rendimiento
3. **Archivos estáticos**: Los archivos en `publics/` se sirven automáticamente
4. **Sesiones**: Las sesiones se almacenan en MongoDB, lo que es compatible con serverless

### Optimizaciones Implementadas

- ✅ **Conexiones MongoDB cacheadas**: Reutiliza conexiones entre invocaciones
- ✅ **Manejo de errores**: No hace `process.exit()` en producción (Vercel)
- ✅ **Configuración serverless**: Optimizada para funciones serverless de Vercel

## 🎉 ¡Listo!

Una vez desplegado, tu aplicación estará disponible en:

- **URL de producción**: `https://tu-proyecto.vercel.app`
- **URL de preview**: Se genera automáticamente para cada push

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Node.js en Vercel](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

**¿Necesitas ayuda?** Revisa los logs en Vercel o consulta la documentación oficial.
