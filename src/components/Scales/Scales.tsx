import React, { useState, useEffect } from 'react';
import productsData from "../../DataJson/products.json";
import styles from './Scales.module.css';
import Calculator from '../Calculator/Calculator';
import ScaleReader from '../ScaleReader/ScaleReader';

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

const Scales: React.FC = () => {
  const [productToWeigh, setProductToWeigh] = useState<Product | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [weighingHistory, setWeighingHistory] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [totalSalePrice, setTotalSalePrice] = useState<number | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedDeviceName, setConnectedDeviceName] = useState<string | null>(null);
  const [scaleError, setScaleError] = useState<string | null>(null);

  const handleWeightUpdate = (weight: number | null) => {
    setCurrentWeight(weight);
  };

  const handleConnectionStatusChange = (status: boolean, deviceName: string | null, error: string | null) => {
    setIsConnected(status);
    setConnectedDeviceName(deviceName);
    setScaleError(error);
  };

  const handleProductSelect = (product: Product) => {
    setProductToWeigh(product);
    setCurrentWeight(null);
    setTotalSalePrice(null);
  };


  useEffect(() => {
    if (currentWeight !== null && productToWeigh) {
      const calculatedTotal = Math.round(currentWeight * productToWeigh.priceRetail);
      setTotalSalePrice(calculatedTotal);
    } else {
      setTotalSalePrice(null);
    }
  }, [currentWeight, productToWeigh]);


  const handleRecordWeighing = () => {
    if (productToWeigh && currentWeight !== null && totalSalePrice !== null) {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setWeighingHistory(prevHistory => [
        `${productToWeigh.name} - ${currentWeight} kg - Total: $${totalSalePrice} (${time})`,
        ...prevHistory.slice(0, 4) 
      ]);
      // setCurrentWeight(null);
      // setTotalSalePrice(null);
    } else {
      alert("Por favor, selecciona un producto y asegúrate de que la báscula esté conectada y proporcionando un peso válido.");
    }
  };


  const handleCalibrate = () => {
    alert("Simulando calibración de la balanza...");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = productsData.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.scalesContainer}>
      <h2>Gestión de Balanzas</h2>
      <p className={styles.scalesIntro}>
        Haz clic en un producto para seleccionarlo y luego conecta tu báscula para obtener el peso real.
      </p>

      <div className={styles.scalesMainLayout}>
        <div className={styles.scalesProductsListColumn}>
          <h3>Productos Disponibles</h3>
          <div className={styles.scalesSearchBar}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.scalesSearchInput}
            />
          </div>
          <div className={styles.scalesProductGrid}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: Product) => (
                <div
                  key={product.id}
                  className={`${styles.scalesProductCard} ${productToWeigh?.id === product.id ? styles.scalesProductCardSelected : ''}`}
                  onClick={() => handleProductSelect(product)}
                >
                  <img src={product.imageUrl} alt={product.name} className={styles.scalesProductImage} />
                  <div className={styles.scalesProductInfo}>
                    <h4 className={styles.scalesProductName}>{product.name}</h4>
                    <p className={styles.scalesProductPrice}>${Math.round(product.priceRetail)}</p>
                    <span className={styles.scalesProductStock}>Stock: {product.stock}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noResultsMessage}>No se encontraron productos que coincidan con tu búsqueda.</p>
            )}
          </div>
        </div>

        <div className={styles.scalesControlColumn}>
          {productToWeigh ? (
            <>
              <div className={styles.scalesSelectedProductInfo}>
                <h3>Pesando: {productToWeigh.name}</h3>
                <div className={styles.productDetailsContent}>
                  <img src={productToWeigh.imageUrl} alt={productToWeigh.name} className={styles.scalesSelectedProductImage} />
                  <div className={styles.productTextInfo}>
                    <p><strong>Descripción:</strong> {productToWeigh.description}</p>
                    <p><strong>Precio Unitario:</strong> ${Math.round(productToWeigh.priceRetail)} / kg</p>
                    <p><strong>Categoría:</strong> {productToWeigh.category}</p>
                    <p><strong>Marca:</strong> {productToWeigh.brand}</p>
                    <p><strong>Despacho:</strong> {productToWeigh.availableForDelivery ? "Sí" : "No"}</p>
                  </div>
                </div>
                <Calculator />
              </div>

              <ScaleReader
                onWeightUpdate={handleWeightUpdate}
                onConnectionStatusChange={handleConnectionStatusChange}
                showUI={true}
              />

              <div className={styles.scaleDisplay}>
                <h3>Lectura de Báscula:</h3>
                {scaleError && <p className={styles.errorMessage}>{scaleError}</p>}
                <p className={styles.scaleValue}>
                  {currentWeight !== null ? `${currentWeight} kg` : '--.-- kg'}
                </p>
                <p className={styles.totalPriceValue}>
                  Total : {totalSalePrice !== null ? `$ ${totalSalePrice}` : '--.--'}
                </p>
                <button
                  className={styles.scaleButton}
                  onClick={handleRecordWeighing}
                  disabled={!productToWeigh || currentWeight === null || !isConnected}
                >
                  Registrar Pesaje
                </button>
                <button className={`${styles.scaleButton} ${styles.secondaryButton}`} onClick={handleCalibrate}>Calibrar Balanza</button>
              </div>
            </>
          ) : (
            <div className={styles.noProductSelectedMessage}>
              <h3>Preparado para Pesar</h3>
              <p>Selecciona un producto de la lista de la izquierda para comenzar el pesaje.</p>
              <i className="fa-solid fa-hand-pointer fa-3x" style={{ marginTop: '20px', color: '#ccc' }}></i>
              <ScaleReader
                onWeightUpdate={handleWeightUpdate}
                onConnectionStatusChange={handleConnectionStatusChange}
                showUI={true}
              />
            </div>
          )}

          <div className={styles.scaleInfo}>
            <h4>Estado de la Balanza:</h4>
            {scaleError ? (
              <p className={styles.errorMessage}>{scaleError}</p>
            ) : (
              <p>
                Conectada: <span className={isConnected ? styles.statusIndicatorConnected : styles.statusIndicatorDisconnected}>●</span>{' '}
                {isConnected ? `Sí (${connectedDeviceName})` : 'No'}
              </p>
            )}
          </div>

          <div className={styles.scaleHistory}>
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