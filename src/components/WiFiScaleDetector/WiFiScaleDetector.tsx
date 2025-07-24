import React, { useState, useEffect } from 'react';
import styles from './WiFiScaleDetector.module.css';

interface WiFiScaleDetectorProps {
  onWeightUpdate: (weight: number | null) => void;
  onConnectionStatusChange?: (isConnected: boolean, deviceName: string | null, error: string | null) => void;
}

const WiFiScaleDetector: React.FC<WiFiScaleDetectorProps> = ({
  onWeightUpdate,
  onConnectionStatusChange,
}) => {
  const [ipAddress, setIpAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const intervalRef = React.useRef<number | null>(null);

  const connectAndReadWiFiScale = async () => {
    setIsConnecting(true);
    setError(null);
    onConnectionStatusChange?.(false, null, 'Conectando...');

    if (!ipAddress) {
      const msg = 'Por favor, ingresa la dirección IP de la báscula Wi-Fi.';
      setError(msg);
      setIsConnecting(false);
      onConnectionStatusChange?.(false, null, msg);
      return;
    }

    try {
      const response = await fetch(`http://${ipAddress}/weight`, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();

      if (data && typeof data.weight === 'number') {
        setCurrentWeight(data.weight);
        onWeightUpdate(data.weight);
        setIsConnected(true);
        onConnectionStatusChange?.(true, `Báscula Wi-Fi (${ipAddress})`, null);
        setError(null);

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(fetchWeight, 1000);
      } else {
        throw new Error('Formato de datos de peso inválido recibido.');
      }
    } catch (err) {
      console.error('Error al conectar o leer la báscula Wi-Fi:', err);
      const errMsg = `Error de conexión Wi-Fi: ${(err as Error).message}`;
      setError(errMsg);
      setIsConnected(false);
      onWeightUpdate(null);
      onConnectionStatusChange?.(false, null, errMsg);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchWeight = async () => {
    try {
      const response = await fetch(`http://${ipAddress}/weight`, { signal: AbortSignal.timeout(3000) });
      if (!response.ok) {
        throw new Error(`Error HTTP en lectura: ${response.status}`);
      }
      const data = await response.json();
      if (data && typeof data.weight === 'number') {
        setCurrentWeight(data.weight);
        onWeightUpdate(data.weight);
        setError(null);
      } else {
        setError('Formato de datos de peso inválido en lectura continua.');
        onWeightUpdate(null);
      }
    } catch (err) {
      console.error('Error en lectura continua de báscula Wi-Fi:', err);
      const errMsg = `Error de lectura Wi-Fi: ${(err as Error).message}`;
      setError(errMsg);
      setIsConnected(false);
      onWeightUpdate(null);
      onConnectionStatusChange?.(false, null, errMsg);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const disconnectWiFiScale = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsConnected(false);
    setCurrentWeight(null);
    setError(null);
    onWeightUpdate(null);
    onConnectionStatusChange?.(false, null, null);
    console.log('Báscula Wi-Fi desconectada.');
  };

  useEffect(() => {
    return () => {
              if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); 

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>Lector de Báscula Wi-Fi</h3>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.inputGroup}>
          <label htmlFor="ipAddress" className={styles.label}>Dirección IP:</label>
          <input
            id="ipAddress"
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="Ej: 192.168.1.100"
            className={styles.input}
            disabled={isConnected || isConnecting} 
          />
        </div>

        <div className={styles.buttonsContainer}>
          <button
            onClick={connectAndReadWiFiScale}
            disabled={isConnected || isConnecting || !ipAddress}
            className={styles.button}
          >
            {isConnecting ? 'Conectando...' : 'Conectar Wi-Fi'}
          </button>
          <button
            onClick={disconnectWiFiScale}
            disabled={!isConnected && !isConnecting}
            className={styles.button}
          >
            Desconectar Wi-Fi
          </button>
        </div>

        {isConnected && (
          <p className={`${styles.statusMessage} ${styles.connected}`}>
            Báscula Wi-Fi conectada: {ipAddress}
          </p>
        )}
        {!isConnected && !error && (
          <p className={`${styles.statusMessage} ${styles.disconnected}`}>
            Báscula Wi-Fi desconectada
          </p>
        )}

        {isConnected ? (
          <p className={styles.weightDisplay}>
            Peso actual: {currentWeight !== null ? `${currentWeight} kg` : '--- kg'}
          </p>
        ) : (
          ipAddress && !error && <p className={styles.statusMessage}>Esperando conexión...</p>
        )}
      </div>
    </div>
  );
};

export default WiFiScaleDetector;