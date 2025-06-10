# 🛒 Test Práctico - Frontend Mercado Libre

Hola, soy **Lautaro Figueroa** y este es el entregable correspondiente al **Test Práctico para Frontend SR** en **Mercado Libre**.

---

## 📌 Descripción del Proyecto

La aplicación simula la experiencia de búsqueda de productos en Mercado Libre, basada en tres vistas principales:

1. **Caja de búsqueda** (`/`)
2. **Resultados de la búsqueda** (`/items?search=iphone`)
3. **Detalle del producto** (`/items/:id`)

Este proyecto utiliza una arquitectura fullstack con dos carpetas separadas:

- `/frontend` → Aplicación React (JSX, Sass, SPA)
- `/backend` → API construida con Express en Node.js

---

## ⚙️ Tecnologías Utilizadas

### 🧠 Cliente (Frontend)
- React
- JavaScript (ES6+)
- HTML semántico
- Sass (estructura BEM)
- Enrutamiento con React Router DOM
- Responsive Design

### 🔧 Servidor (Backend)
- Node.js v20+
- Express
- MOCKS

---

## 📁 Estructura del Proyecto

```
│
├── /frontend        → React App (SPA)
├── /backend         → API Node.js con Express
└── package.json     → Scripts globales para levantar ambos
```

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/test-frontend-mercadolibre.git
cd test-frontend-mercadolibre
cd frontend
cd backend
```

### 2. Instalar dependencias (frontend & backend)

```bash
npm run install 
```

### 3. Levantar la app en modo desarrollo

```bash
npm run dev
```
---

## 🧪 Funcionalidades Implementadas

- [x] Navegación por URL entre vistas
- [x] Caja de búsqueda funcional
- [x] Renderizado de resultados con precio, cuotas, envío, etc.
- [x] Vista de detalle con descripción, imágenes y atributos
- [x] Breadcrumb desde `category_path_from_root`
- [x] Formato de precios, moneda y cuotas
- [x] Responsive Design
- [x] Mensaje de bienvenida (primera visita)
- [x] SEO friendly (etiquetas y metadatos) + react-helmet-async
- [x] Arquitectura escalable

---

## 📜 Endpoints Implementados

### `GET /api/items?q=iphone&offset=0`

Formato estructurado para el frontend.

---

## 🎯 Extras opcionales (no obligatorios pero considerados)

- [x] Mensaje de bienvenida en primer ingreso
- [x] Control de estado para evitar múltiples llamadas innecesarias
- [x] Soporte para paginación con `offset`
- [x] Componente de paginación visual
- [x] Caching de resultados por sesión

---

## ✅ Requisitos

- Node.js v20+
- npm

---

## ✍️ Autor

**Lautaro Figueroa**  
Frontend SR Candidate · Mercado Libre  
[GitHub](https://github.com/LauElToro)

---
