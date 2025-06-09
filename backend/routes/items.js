import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const basePath = path.join(__dirname, '../public');

const CATEGORIES = ['iphone', 'zapatillas', 'camisa', 'cafe', 'arroz'];

const sellerCache = new Map();

function detectCategory(query) {
  const normalized = query.toLowerCase();
  const aliases = {
    iphone: 'iphone',
    iphones: 'iphone',
    zapatilla: 'zapatillas',
    zapatillas: 'zapatillas',
    camisa: 'camisa',
    camisas: 'camisa',
    cafe: 'cafe',
    café: 'cafe',
    arroz: 'arroz',
  };
  return aliases[normalized] || null;
}

router.get('/', async (req, res) => {
  const { q } = req.query;
  const category = detectCategory(q);

  if (!category) {
    return res.status(400).json({ error: 'Categoría no reconocida.' });
  }

  try {
    const filePath = path.join(basePath, category, `search-MLA-${category}.json`);
    const file = await fs.readFile(filePath, 'utf8');
    const searchData = JSON.parse(file);

    const results = searchData.results.filter(p =>
      p.title.toLowerCase().includes(q?.toLowerCase() || '')
    );

    const categories =
      searchData.filters?.find(f => f.id === 'category')?.values?.map(c => c.name) || [];

    const items = results.map(item => {
      const sellerName = item.seller?.nickname || null;

      if (item.seller?.id && sellerName) {
        sellerCache.set(item.seller.id, sellerName);
      }

      return {
        id: item.id,
        title: item.title,
        price: {
          currency: item.currency_id,
          amount: item.price,
          decimals: parseFloat((item.price % 1).toFixed(2)),
          regular_amount: item.original_price || null,
        },
        picture: item.thumbnail.replace(/-I\.(jpg|png|webp)$/, "-O.jpg"),
        condition: item.condition,
        free_shipping: item.shipping?.free_shipping || false,
        installments: item.installments
          ? `${item.installments.quantity} cuotas`
          : null,
        seller: sellerName ? { name: sellerName } : null,
      };
    });

    res.json({ categories, items });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo leer el archivo de búsqueda.' });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  for (const category of CATEGORIES) {
    try {
      const categoryPath = path.resolve(basePath, category);
      const item = JSON.parse(await fs.readFile(path.join(categoryPath, `item-${id}.json`), 'utf8'));
      const description = JSON.parse(await fs.readFile(path.join(categoryPath, `item-${id}-description.json`), 'utf8'));
      const categoryData = JSON.parse(await fs.readFile(path.join(categoryPath, `item-${id}-category.json`), 'utf8'));

      const sellerName = sellerCache.get(item.seller_id) || "Vendedor desconocido";

      return res.json({
        item: {
          id: item.id,
          title: item.title,
          price: {
            currency: item.currency_id,
            amount: item.price,
            decimals: parseFloat((item.price % 1).toFixed(2)),
            regular_amount: item.original_price || null,
          },
          pictures: item.pictures.map(p => p.secure_url),
          condition: item.condition,
          free_shipping: item.shipping?.free_shipping,
          sold_quantity: item.initial_quantity - (item.available_quantity || 0),
          installments: item.installments
            ? {
                quantity: item.installments.quantity,
                amount: item.installments.amount,
                rate: item.installments.rate,
              }
            : null,
          description: description.plain_text,
          attributes: item.attributes?.map(attr => ({
            id: attr.id,
            name: attr.name,
            value_name: attr.value_name,
          })) || [],
          category_path_from_root: categoryData.path_from_root.map(p => p.name),
          warranty: item.warranty || null,
          seller: {
            id: item.seller_id,
            name: sellerName,
          },
        },
      });
    } catch (err) {
      continue;
    }
  }

  res.status(404).json({ error: 'Producto no encontrado' });
});

export default router;
