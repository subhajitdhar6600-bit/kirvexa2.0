# Farma Web (Client & Server)

This repository is organized into two primary folders:

```
├── client/          # Frontend React + Vite + Tailwind CSS Application
└── server/          # Backend Node.js + Express + MongoDB REST API
```

---

## 🚀 Getting Started

### 1. Install Dependencies
You can install dependencies for both client and server from the root directory:
```bash
npm run install:all
```
*(or run `npm install` inside both `client/` and `server/`)*

---

### 2. Environment Configuration
Make sure your environment files are configured:
- **`client/.env`**: Frontend settings (e.g., `VITE_API_URL=http://localhost:5000/api`)
- **`server/.env`**: Backend settings (e.g., `PORT=5000`, `MONGODB_URI=...`)

---

### 3. Running the Applications

#### Run Both (Concurrently):
```bash
npm run dev
```

#### Run Only the Frontend (Client):
```bash
npm run client
# Or:
cd client && npm run dev
```

#### Run Only the Backend (Server):
```bash
npm run server
# Or:
cd server && npm run dev
```

#### Build Frontend for Production:
```bash
npm run build
# Or:
npm run client:build
```

---

## 📂 Folder Overview

### `client/`
- `src/`: React source code (components, pages, hooks, state, styles).
- `public/`: Static assets (icons, images, logos).
- `vite.config.ts`: Vite build and dev proxy configuration (proxies `/api` to port 5000).
- `package.json`: Frontend dependencies and build scripts.

### `server/`
- `config/`: Database connection (`db.js`).
- `models/`: Mongoose schemas and models (Users, Crops, KCC, Mandi, Orders, etc.).
- `routes/`: Express API endpoints.
- `index.js`: Server entry point.
- `package.json`: Backend dependencies and scripts.
