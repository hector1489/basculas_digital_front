import './Products.css';
import type React from "react";
import { useState } from 'react';
import productsData from "../../DataJson/products.json";
import ProductDetail from '../ProductDetail/ProductDetail';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  longDescription?: string;
  stock?: number;
}

const Products: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="products-container">
      <h2>Nuestros Productos</h2>
      <div className="products-layout">
        <div className="products-list-column">
          <div className="products-grid">
            {productsData.map((product: Product) => (
              <div
                key={product.id}
                className={`product-card ${selectedProduct?.id === product.id ? 'product-card-selected' : ''}`}
                onClick={() => handleProductClick(product)}
              >
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="product-detail-column">
          {selectedProduct ? (
            <ProductDetail product={selectedProduct} />
          ) : (
            <p className="no-product-selected-message">
              Selecciona un producto de la lista para ver sus detalles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;