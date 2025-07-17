import './Products.css';
import type React from "react";
import { useState } from 'react';
import productsData from "../../DataJson/products.json";
import ProductDetail from '../ProductDetail/ProductDetail';
import EditProductForm from '../EditProductForm/EditProductForm';

interface Product {
  id: string;
  name: string;
  description: string;
  priceRetail: number;
  priceSupplier: number;
  priceEmployee: number;
  imageUrl: string;
  availableForDelivery: boolean;
  stock: number;
  category: string;
  brand: string;
}

const Products: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [products, setProducts] = useState<Product[]>(productsData);


  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(prod =>
        prod.id === updatedProduct.id ? updatedProduct : prod
      )
    );
    setSelectedProduct(updatedProduct);
    setIsEditing(false);
    alert(`Producto "${updatedProduct.name}" actualizado con éxito.`);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="products-container">
      <h2>Nuestros Productos</h2>
      <div className="products-layout">
        <div className="products-list-column">
          <div className="products-grid">
            {products.map((product: Product) => (
              <div
                key={product.id}
                className={`product-card ${selectedProduct?.id === product.id ? 'product-card-selected' : ''}`}
                onClick={() => handleProductClick(product)}
              >
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">${product.priceRetail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="product-detail-column">
          {selectedProduct ? (
            isEditing ? (
              <EditProductForm
                product={selectedProduct}
                onSave={handleSaveProduct}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                <ProductDetail product={selectedProduct} />
                <div className="product-detail-actions">
                  <button onClick={handleEditClick} className="edit-product-button">
                    Editar Producto
                  </button>
                </div>
              </>
            )
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