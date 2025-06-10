const API_BASE_URL = "http://localhost:3000/api/items";

export const fetchItems = async (query) => {
  const res = await fetch(`${API_BASE_URL}?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Error al buscar productos");

  const data = await res.json();

  return {
    items: Array.isArray(data.items) ? data.items : [],
    categories: Array.isArray(data.categories) ? data.categories : []
  };
};

export const fetchItemDetail = async (id) => {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener detalle del producto");
  const data = await res.json();
  return data;
};
