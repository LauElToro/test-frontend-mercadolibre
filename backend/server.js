import express from 'express';
import cors from 'cors';
import itemsRoutes from './routes/items.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/items', itemsRoutes);

app.get('/', (req, res) => {
  res.send('🟢 Backend de Mercado Libre Mock corriendo...');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
