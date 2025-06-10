import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const basePath = path.join(__dirname, '../public');

const CATEGORIES = ['iphone', 'zapatillas', 'camisa', 'cafe', 'arroz'];
const sellerCache = new Map();
const itemCache = new Map();

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

      itemCache.set(item.id, {
        price: item.price,
        installments: item.installments || null,
        free_shipping: item.shipping?.free_shipping || false,
      });

      return {
        id: item.id,
        title: item.title,
        price: {
          currency: item.currency_id,
          amount: item.price,
          decimals: parseFloat((item.price % 1).toFixed(2)),
          regular_amount: null,
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
      const itemFile = path.join(categoryPath, `item-${id}.json`);
      const descriptionFile = path.join(categoryPath, `item-${id}-description.json`);
      const categoryFile = path.join(categoryPath, `item-${id}-category.json`);

      const item = JSON.parse(await fs.readFile(itemFile, 'utf8'));
      const description = JSON.parse(await fs.readFile(descriptionFile, 'utf8'));
      const categoryData = JSON.parse(await fs.readFile(categoryFile, 'utf8'));

      const fallback = itemCache.get(item.id) || {};
      const sellerName = sellerCache.get(item.seller_id) || "Vendedor desconocido";

      const price = item.price ?? fallback.price ?? 0;
      const installments = item.installments ?? fallback.installments ?? null;

      const cuotasTotal = installments
        ? installments.quantity * installments.amount
        : null;

      const hasInstallmentDiscount = cuotasTotal && cuotasTotal < price;

      const discountedPrice = hasInstallmentDiscount
        ? Math.round(cuotasTotal)
        : price;

      const regularPrice = hasInstallmentDiscount ? price : null;

      const sold_quantity =
        typeof item.sold_quantity === "number" && item.sold_quantity > 0
          ? item.sold_quantity
          : 25; 

      return res.json({
        item: {
          id: item.id,
          title: item.title,
          price: {
            currency: item.currency_id,
            amount: discountedPrice,
            decimals: parseFloat((discountedPrice % 1).toFixed(2)),
            regular_amount: regularPrice,
          },
          pictures: item.pictures.map((p) => p.secure_url),
          condition: item.condition,
          free_shipping: item.shipping?.free_shipping ?? fallback.free_shipping ?? false,
          sold_quantity,
          installments: installments || null,
          description: description.plain_text,
          attributes: item.attributes?.map((attr) => ({
            id: attr.id,
            name: attr.name,
            value_name: attr.value_name,
          })) || [],
          category_path_from_root: categoryData.path_from_root.map((p) => p.name),
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
