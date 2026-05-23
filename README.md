# ⚽ NEXUS Football — IA del Fútbol

Aplicación web full-stack de inteligencia artificial especializada en fútbol. Los usuarios pueden registrarse, iniciar sesión y chatear con una IA que responde preguntas sobre jugadores, competiciones, récords y estadísticas del fútbol mundial.

## 🚀 Funcionalidades

- **🤖 Chat con IA** — Asistente inteligente (LLaMA 3.3 70B vía Groq) especializado exclusivamente en fútbol
- **🔴 Datos en tiempo real** — Clasificaciones, goleadores y partidos actualizados vía football-data.org
- **⭐ Búsqueda de jugadores** — Stats, carrera y palmarés de cualquier jugador
- **⚔️ Comparador de jugadores** — Comparación lado a lado con veredicto de la IA
- **🏆 Récords históricos** — Los récords imbatibles del fútbol mundial
- **🔐 Autenticación** — Registro y login con JWT y contraseñas cifradas (bcrypt)
- **💾 Historial de chat** — Conversaciones guardadas por usuario

## 🛠️ Tecnologías

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Markdown

### Backend
- Node.js + Express
- NeDB (base de datos embebida)
- JWT (JSON Web Tokens)
- Bcryptjs (encriptación de contraseñas)
- Groq SDK (LLaMA 3.3 70B)
- football-data.org API

## 📦 Instalación y uso

### Requisitos
- Node.js 18+
- Cuenta en [Groq](https://console.groq.com) (gratis)
- Cuenta en [football-data.org](https://www.football-data.org) (gratis)

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/nexus-football.git
cd nexus-football
```

### 2. Configurar el backend
```bash
cd server
npm install
cp .env.example .env
# Editar .env con tus API keys
```

### 3. Configurar el frontend
```bash
cd ../client
npm install
```

### 4. Variables de entorno (server/.env)
```
GROQ_API_KEY=tu_api_key_de_groq
FOOTBALL_API_KEY=tu_api_key_de_football_data
JWT_SECRET=una_clave_secreta_larga
PORT=3001
```

### 5. Arrancar la aplicación
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Abrir en: **http://localhost:5173**

## 🏗️ Estructura del proyecto

```
nexus-football/
├── client/                  # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Chat.jsx     # Chat con IA
│   │   │   ├── Live.jsx     # Datos en tiempo real
│   │   │   ├── Players.jsx  # Búsqueda y comparador
│   │   │   └── Records.jsx  # Récords históricos
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── App.jsx
│   └── package.json
└── server/                  # Backend Node.js
    ├── routes/
    │   ├── auth.js          # Login y registro
    │   ├── chat.js          # IA con Groq
    │   ├── football.js      # API football-data.org
    │   └── player.js        # Búsqueda/comparación IA
    ├── middleware/
    │   └── auth.js          # Verificación JWT
    ├── db.js                # Configuración NeDB
    ├── server.js            # Entrada del servidor
    └── package.json
```

## 🔒 Seguridad

- Contraseñas cifradas con **bcrypt** (salt rounds: 10)
- Autenticación con **JWT** (expira en 7 días)
- Variables sensibles en `.env` (no incluido en el repositorio)
- Rate limiting respetado en llamadas a APIs externas

## 🌐 APIs externas utilizadas

| API | Uso | Plan |
|-----|-----|------|
| [Groq](https://groq.com) | LLM (LLaMA 3.3 70B) | Gratuito |
| [football-data.org](https://football-data.org) | Datos de fútbol en tiempo real | Gratuito |

---

