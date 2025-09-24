# 1) builder: instala deps e compila TS
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# copia apenas package-lock e package para aproveitar cache
COPY package*.json ./

# instala todas as deps (dev + prod) para compilar
RUN npm ci

# copia tsconfig e código fonte
COPY tsconfig.json ./
COPY src ./src

# build da aplicação para dist/
RUN npm run build

# 2) runner: imagem final enxuta com apenas dependências de produção
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=development

# copia package files e instala apenas dependencies de produção
COPY package*.json ./
RUN npm ci --omit=dev

# copia o build (JS) do estágio builder
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
