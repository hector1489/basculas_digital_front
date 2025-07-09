import type React from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  longDescription?: string;
  stock?: number;
}

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <div className="product-detail-card">
      <img src={product.imageUrl} alt={product.name} className="detail-image" />
      <h2 className="detail-name">{product.name}</h2>
      <p className="detail-description">{product.description}</p>
      {product.longDescription && <p className="detail-description">{product.longDescription}</p>}
      <p className="detail-price">${product.price.toFixed(2)}</p>
      {product.stock !== undefined && <p>Stock disponible: {product.stock}</p>}
      <button className="detail-action-button">Añadir al Carrito</button>
    </div>
  );
};

export default ProductDetail;