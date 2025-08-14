FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]


# FROM node:22-alpine

# WORKDIR /usr/src/app

# COPY --from=builder /usr/src/app/node_modules ./node_modules
# COPY --from=builder /usr/src/app/package*.json ./

# COPY --from=builder /usr/src/app/dist ./dist

# EXPOSE 3000

# CMD ["node", "dist/main"]