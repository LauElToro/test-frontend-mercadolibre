import express from 'express';
import cors from 'cors';
import itemsRoutes from './routes/items.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/items', itemsRoutes);

// Home
app.get('/', (req, res) => {
  res.send('🟢 Backend de Mercado Libre Mock corriendo...');
});

// Error 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
