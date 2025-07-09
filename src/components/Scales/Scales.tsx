import type React from 'react';
import { useState } from 'react';
import productsData from "../../DataJson/products.json";
import './Scales.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  longDescription?: string;
  stock?: number;
}

const Scales: React.FC = () => {
  const [productToWeigh, setProductToWeigh] = useState<Product | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [weighingHistory, setWeighingHistory] = useState<string[]>([]);

  const handleProductSelect = (product: Product) => {
    setProductToWeigh(product);
    setCurrentWeight(null);
  };

  const handleStartWeighing = () => {
    if (productToWeigh) {
      const simulatedWeight = (Math.random() * 5 + 0.1).toFixed(2);
      setCurrentWeight(parseFloat(simulatedWeight));

      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setWeighingHistory(prevHistory => [`${simulatedWeight} kg de ${productToWeigh.name} - ${time}`, ...prevHistory.slice(0, 4)]);
    } else {
      alert("Por favor, selecciona un producto de la lista para pesar.");
    }
  };

  const handleCalibrate = () => {
    alert("Simulando calibración de la balanza...");
  };

  return (
    <div className="scales-container">
      <h2>Gestión de Balanzas</h2>
      <p className="scales-intro">
        Haz clic en un producto para seleccionarlo y simular su pesaje.
      </p>

      <div className="scales-main-layout">
        <div className="scales-products-list-column">
          <h3>Productos Disponibles</h3>
          <div className="scales-product-grid">
            {productsData.map((product: Product) => (
              <div
                key={product.id}
                className={`scales-product-card ${productToWeigh?.id === product.id ? 'scales-product-card-selected' : ''}`}
                onClick={() => handleProductSelect(product)}
              >
                <img src={product.imageUrl} alt={product.name} className="scales-product-image" />
                <div className="scales-product-info">
                  <h4 className="scales-product-name">{product.name}</h4>
                  <p className="scales-product-price">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="scales-control-column">
          {productToWeigh ? (
            <>
              <div className="scales-selected-product-info">
                <h3>Pesando: {productToWeigh.name}</h3>
                <img src={productToWeigh.imageUrl} alt={productToWeigh.name} className="scales-selected-product-image" />
                <p>{productToWeigh.description}</p>
                <p>Precio Unitario: ${productToWeigh.price.toFixed(2)}</p>
              </div>

              <div className="scale-display">
                <h3>Lectura Actual:</h3>
                <p className="scale-value">
                  {currentWeight !== null ? `${currentWeight.toFixed(2)} kg` : '--.-- kg'}
                </p>
                <button className="scale-button" onClick={handleStartWeighing}>
                  Pesar {productToWeigh.name}
                </button>
                <button className="scale-button secondary" onClick={handleCalibrate}>Calibrar</button>
              </div>
            </>
          ) : (
            <div className="no-product-selected-message">
              <h3>Preparado para Pesar</h3>
              <p>Selecciona un producto de la lista de la izquierda para comenzar el pesaje.</p>
              <i className="fa-solid fa-hand-pointer fa-3x" style={{marginTop: '20px', color: '#ccc'}}></i>
            </div>
          )}

          <div className="scale-info">
            <h4>Estado de la Balanza:</h4>
            <p>Conectada: <span className="status-indicator connected">●</span> Sí</p>
            <p>Última actualización: hace 5 segundos</p>
          </div>

          <div className="scale-history">
            <h4>Historial de Pesajes Recientes:</h4>
            <ul>
              {weighingHistory.length > 0 ? (
                weighingHistory.map((entry, index) => (
                  <li key={index}>{entry}</li>
                ))
              ) : (
                <li>No hay pesajes recientes.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scales;