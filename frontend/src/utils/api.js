const API_BASE_URL = "http://localhost:3000/api";

export const fetchItems = async (query) => {
  const res = await fetch(`http://localhost:3000/api/items?q=${query}`);
  if (!res.ok) throw new Error("Error al buscar productos");
  
  const data = await res.json();

  return {
    items: Array.isArray(data.items) ? data.items : [],
    categories: Array.isArray(data.categories) ? data.categories : []
  };
};

export const fetchItemDetail = async (id) => {
  const res = await fetch(`http://localhost:3000/api/items/${id}`);
  if (!res.ok) throw new Error("Error al obtener detalle del producto");
  return await res.json();
};

export const fetchItemById = async (id) => {
  const res = await fetch(`${API_BASE}/items/${id}`);
  if (!res.ok) throw new Error('Error al obtener producto');
  return res.json();
};
