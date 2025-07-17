import React from 'react';
import styles from './ProductDetail.module.css';

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

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <div className={styles.productDetailCard}>
      <img src={product.imageUrl} alt={product.name} className={styles.productDetailImage} />
      <div className={styles.productDetailInfo}>
        <h2 className={styles.productDetailName}>{product.name}</h2>
        <p className={styles.productDetailDescription}>{product.description}</p>

        <div className={styles.productPrices}>
          <p><strong>Precio Público:</strong> ${product.priceRetail}</p>
          <p><strong>Precio Proveedor:</strong> ${product.priceSupplier}</p>
          <p><strong>Precio Empleado:</strong> ${product.priceEmployee}</p>
        </div>

        <p><strong>Categoría:</strong> {product.category}</p>
        <p><strong>Marca:</strong> {product.brand}</p>
        <p><strong>Stock Disponible:</strong> {product.stock} unidades</p>
        <p>
          <strong>Despacho Disponible:</strong>{" "}
          {product.availableForDelivery ? "Sí" : "No"}
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;