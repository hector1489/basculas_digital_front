import React, { useState, useEffect } from 'react';
import styles from './EditProductForm.module.css';

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

interface EditProductFormProps {
  product: Product;
  onSave: (updatedProduct: Product) => void;
  onCancel: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onSave, onCancel }) => {
  const [editedProduct, setEditedProduct] = useState<Product>(product);

  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setEditedProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedProduct.name || editedProduct.priceRetail <= 0 || editedProduct.stock < 0) {
      alert("Por favor, rellena todos los campos obligatorios y asegúrate de que los precios y stock son válidos.");
      return;
    }
    onSave(editedProduct);
  };

  return (
    <div className={styles.editFormContainer}>
      <h3>Editar Producto: {product.name}</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.formLabel}>Categoría:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={editedProduct.category}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="brand" className={styles.formLabel}>Marca:</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={editedProduct.brand}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="stock" className={styles.formLabel}>Stock:</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={editedProduct.stock}
              onChange={handleChange}
              className={styles.formInput}
              min="0"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="description" className={styles.formLabel}>Descripción:</label>
            <textarea
              id="description"
              name="description"
              value={editedProduct.description}
              onChange={handleChange}
              className={styles.formTextarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="priceRetail" className={styles.formLabel}>Precio Público ($):</label>
            <input
              type="number"
              id="priceRetail"
              name="priceRetail"
              value={editedProduct.priceRetail}
              onChange={handleChange}
              className={styles.formInput}
              step="0.01"
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="priceSupplier" className={styles.formLabel}>Precio Proveedor ($):</label>
            <input
              type="number"
              id="priceSupplier"
              name="priceSupplier"
              value={editedProduct.priceSupplier}
              onChange={handleChange}
              className={styles.formInput}
              step="0.01"
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="priceEmployee" className={styles.formLabel}>Precio Empleado ($):</label>
            <input
              type="number"
              id="priceEmployee"
              name="priceEmployee"
              value={editedProduct.priceEmployee}
              onChange={handleChange}
              className={styles.formInput}
              step="0.01"
              min="0"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="imageUrl" className={styles.formLabel}>URL de la Imagen:</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={editedProduct.imageUrl}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="availableForDelivery"
              name="availableForDelivery"
              checked={editedProduct.availableForDelivery}
              onChange={handleChange}
              className={styles.checkboxInput}
            />
            <label htmlFor="availableForDelivery" className={styles.formLabel}>Disponible para Despacho</label>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.saveButton}>Guardar Cambios</button>
          <button type="button" onClick={onCancel} className={styles.cancelButton}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;