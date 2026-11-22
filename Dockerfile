# Stage 1: Build dell'applicazione Angular
FROM node:22-alpine AS build

WORKDIR /app

# Copia la definizione delle dipendenze
COPY package*.json ./

# Installa le dipendenze
RUN npm ci

# Copia l'intero progetto
COPY . .

# Compila l'applicazione per la produzione
RUN npm run build

# Stage 2: Nginx Web Server
FROM nginx:alpine

# Rimuove la configurazione predefinita di Nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copia la configurazione personalizzata
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copia l'output della build Angular nella cartella statica di Nginx
COPY --from=build /app/dist/expense-tracker-ng/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

