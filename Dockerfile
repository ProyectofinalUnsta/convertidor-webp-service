FROM node:18-alpine

# Dependencias necesarias para sharp
RUN apk add --no-cache \
    vips \
    vips-dev \
    fftw-dev \
    build-base \
    libc6-compat

# Establecer directorio de trabajo
WORKDIR /

# Copiar package.json y instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de archivos (incluyendo index.js)
COPY . .

# Exponer puerto 3000
EXPOSE 3000

# Comando de inicio
CMD ["node", "index.js"]
