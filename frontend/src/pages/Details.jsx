import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchItemDetail } from "../utils/api";
import 'bootstrap/dist/css/bootstrap.min.css';

const Details = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    fetchItemDetail(id)
      .then(({ item }) => {
        setItem(item);
        setActiveImage(item.pictures?.[0] || "");
      })
      .catch(console.error);
  }, [id]);

  if (!item) return <div className="text-center py-5">Cargando detalle...</div>;

  return (
    <div className="container my-5">
      <div className="row gx-4 gy-4">
        {/* Miniaturas: columna estrecha */}
        <div className="col-2 d-none d-md-flex flex-column align-items-center">
          {item.pictures.map((pic) => (
            <img
              key={pic}
              src={pic}
              alt={item.title}
              className={`img-thumbnail mb-2 thumbnail ${
                pic === activeImage ? "border-primary" : ""
              }`}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setActiveImage(pic)}
            />
          ))}
        </div>

        <div className="col-12 col-md-6">
          <div className="ratio ratio-1x1">
            <img
              src={activeImage}
              alt={item.title}
              className="img-fluid object-fit-cover"
            />
          </div>
        </div>

        {/* Información */}
        <div className="col-12 col-md-4">
          <p className="text-muted mb-2">
            {item.condition === "new" ? "Nuevo" : "Usado"} · {item.sold_quantity} vendidos
          </p>

          {item.category_path_from_root?.length > 0 && (
            <p className="text-muted small mb-3">
              {item.category_path_from_root.join(" > ")}
            </p>
          )}

          <h1 className="h4 mb-3">{item.title}</h1>

          <h2 className="display-6 text-dark mb-3">
            ${item.price.amount.toLocaleString("es-AR")}
          </h2>

          {item.price.regular_amount && (
            <p className="text-muted mb-2">
              <del>${item.price.regular_amount.toLocaleString("es-AR")}</del>
            </p>
          )}

          {item.installments?.quantity && item.installments?.amount && (
            <p className="text-muted mb-4">
              {item.installments.quantity} cuotas de $
              {item.installments.amount.toLocaleString("es-AR")}
            </p>
          )}

          <button className="btn btn-primary btn-lg mb-4">Comprar</button>
        </div>
      </div>

      {/* Descripción */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="h5 mb-2">Descripción del producto</h3>
          <p className="text-secondary">
            {item.description && item.description.length > 10
              ? item.description
              : "No se encontró descripción para este producto."}
          </p>
        </div>
      </div>

      {/* Atributos */}
      {item.attributes?.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <h3 className="h5 mb-2">Características</h3>
            <ul className="list-unstyled">
              {item.attributes.map((attr) => (
                <li key={attr.id} className="mb-1">
                  <strong>{attr.name}:</strong> {attr.value_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
