// products.json
import './Products.css';
import type React from "react";
import { useState } from 'react';
import productsData from "../../DataJson/products.json"; // Asegúrate de que este JSON sea el actualizado
import ProductDetail from '../ProductDetail/ProductDetail';
import EditProductForm from '../EditProductForm/EditProductForm'; // Importaremos este nuevo componente

// Actualiza la interfaz Product para que coincida con el JSON robusto
interface Product {
  id: string;
  name: string;
  description: string;
  priceRetail: number; // Precio de venta al público
  priceSupplier: number; // Precio para proveedores
  priceEmployee: number; // Precio para empleados
  imageUrl: string;
  availableForDelivery: boolean;
  stock: number;
  category: string;
  brand: string;
  // longDescription ya no sería necesario si `description` es suficiente o si lo añades directamente
}

const Products: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // Nuevo estado para controlar si estamos en modo edición
  const [isEditing, setIsEditing] = useState(false);
  // Estado para la lista de productos, que podremos modificar si editamos
  const [products, setProducts] = useState<Product[]>(productsData);


  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(false); // Al seleccionar un nuevo producto, salimos del modo edición
  };

  // Función para iniciar el modo edición
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Función para guardar los cambios del producto editado
  const handleSaveProduct = (updatedProduct: Product) => {
    // Aquí actualizamos el estado local de los productos
    setProducts(prevProducts =>
      prevProducts.map(prod =>
        prod.id === updatedProduct.id ? updatedProduct : prod
      )
    );
    setSelectedProduct(updatedProduct); // También actualizamos el producto seleccionado
    setIsEditing(false); // Salimos del modo edición
    alert(`Producto "${updatedProduct.name}" actualizado con éxito.`);
  };

  // Función para cancelar la edición
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="products-container">
      <h2>Nuestros Productos</h2>
      <div className="products-layout">
        <div className="products-list-column">
          <div className="products-grid">
            {products.map((product: Product) => ( // Usamos 'products' del estado
              <div
                key={product.id}
                className={`product-card ${selectedProduct?.id === product.id ? 'product-card-selected' : ''}`}
                onClick={() => handleProductClick(product)}
              >
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  {/* Mostrar priceRetail */}
                  <p className="product-price">${product.priceRetail.toFixed(2)}</p>
                  {/* Puedes añadir más información si quieres que se vea en la tarjeta */}
                  {/* <p className="product-stock">Stock: {product.stock}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="product-detail-column">
          {selectedProduct ? (
            isEditing ? (
              // Si estamos editando, mostramos el formulario de edición
              <EditProductForm
                product={selectedProduct}
                onSave={handleSaveProduct}
                onCancel={handleCancelEdit}
              />
            ) : (
              // Si no estamos editando, mostramos los detalles y el botón de edición
              <>
                <ProductDetail product={selectedProduct} />
                <div className="product-detail-actions">
                  <button onClick={handleEditClick} className="edit-product-button">
                    Editar Producto
                  </button>
                  {/* Aquí podrías añadir un botón de eliminar */}
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