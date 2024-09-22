# Etapa 1: Build del código TypeScript
FROM node:18-alpine AS builder

# Crear directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar el código TypeScript
RUN npm run build

# Etapa 2: Imagen final
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Exponer el puerto en el que corre la app
EXPOSE 3000

# Variable de entorno para producción
ENV NODE_ENV=production

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]
