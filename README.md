# 🚀 Express API with TypeScript, MySQL and Docker

A simple **Express.js API** built with **TypeScript**, designed to run in both **development** (with hot reload) and **production** environments using **Docker**.

---

## 📦 Features

- ⚡ **Express.js + TypeScript**
- 🎲 **MySQL + PHPMyAdmin**
- 🔄 Hot reload in development via `ts-node-dev`
- 🐳 Dockerized setup for dev and production
- 📂 Modular project structure (routes, controllers, services, repositories)
- 🔐 Environment variables support

---

```
## 🏗 Project Structure

src/
├── app.ts # Main application setup
├── index.ts # Entry point
├── config/ # Config files (database, env, etc.)
├── controllers/ # Route handlers
├── repositories/ # Data access layer
├── routes/ # API routes
├── services/ # Business logic
├── types/ # TypeScript type definitions

```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/BryanJonathan/express-docker-ts.git
cd my-express-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

At the root, create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=3000
# Add any other variables as needed
```

---

## 🐳 Running the Project

### Development Mode (with hot reload)

```bash
docker compose up --build
```

The application will be available at:

👉 [http://localhost:3000/health](http://localhost:3000/health)

### Production Mode

```bash
docker build -f Dockerfile.prod -t my-express-api:prod .
docker run -p 3000:3000 my-express-api:prod
```

---

## 🔄 Useful Commands

| Command                                                    | Description                                          |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| `docker compose up --build`                                | Start containers in development mode with hot reload |
| `docker compose down`                                      | Stop containers                                      |
| `docker build -f Dockerfile.prod -t my-express-api:prod .` | Build production image                               |
| `docker run -p 3000:3000 my-express-api:prod`              | Run production container                             |

---

## 🔧 Troubleshooting

- **Port conflicts:** Ensure no other service uses the same ports (e.g., 3000).
- **Docker issues:** Make sure Docker Desktop is running and updated.

---

## 🛠 Tech Stack

- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use and modify it.
