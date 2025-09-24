---

📄 **README.md**

```markdown
# 🚀 Express API with TypeScript and Docker

This project is a simple **Express.js API** built with **TypeScript** and designed to run in both **development** (with hot reload) and **production** environments using **Docker**.

---

## 📦 Features

- ⚡ Express.js + TypeScript
- 🔄 Hot reload in development (via `ts-node-dev`)
- 🐳 Dockerized setup for dev and production
- 📂 Organized project structure (routes, app, index)
- 🔐 Environment variables support

---

## 📂 Project Structure

```

my-express-api/
├── src/
│   ├── routes/
│   │   └── health.ts
│   ├── app.ts
│   └── index.ts
├── .dockerignore
├── .gitignore
├── Dockerfile.dev
├── Dockerfile.prod
├── docker-compose.yml
├── docker-compose.override.yml
├── package.json
├── tsconfig.json
└── README.md

```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/my-express-api.git
cd my-express-api
```

---

### 2. Create environment file

At the root of the project, create a `.env` file:

```env
NODE_ENV=development
PORT=3000
```

You can add more variables depending on your project needs.

---

### 3. Run in development mode

This will use **Dockerfile.dev** and enable **hot reload**.

```bash
docker compose up --build
```

Now visit 👉 [http://localhost:3000/health](http://localhost:3000/health)

---

### 4. Run in production mode

Build the production image using **Dockerfile.prod**:

```bash
docker build -f Dockerfile.prod -t my-express-api:prod .
docker run -p 3000:3000 my-express-api:prod
```

---

## 🔄 Useful Commands

| Command                                                    | Description                                  |
| ---------------------------------------------------------- | -------------------------------------------- |
| `docker compose up`                                        | Start containers in dev mode with hot reload |
| `docker compose down`                                      | Stop containers                              |
| `docker build -f Dockerfile.prod -t my-express-api:prod .` | Build production image                       |
| `docker run -p 3000:3000 my-express-api:prod`              | Run production container                     |

---

## 🛠 Tech Stack

- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)

---

## 📜 License

This project is licensed under the **MIT License**.
Feel free to use and modify it as you like.
