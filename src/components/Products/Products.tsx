import './Products.css'
import type React from "react";
import productsData from "../../DataJson/products.json";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Products: React.FC = () => {
  return (
    <div>
      <h2>Nuestros Productos</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        {productsData.map((product: Product) => (
          <div key={product.id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
            <img src={product.imageUrl} alt={product.name} style={{ maxWidth: "100%", height: "150px", objectFit: "cover", marginBottom: "10px", borderRadius: "4px" }} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p style={{ fontWeight: "bold", color: "#007bff" }}>${product.price.toFixed(2)}</p>
            <button style={{ background: "#28a745", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>Ver Detalle</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;


