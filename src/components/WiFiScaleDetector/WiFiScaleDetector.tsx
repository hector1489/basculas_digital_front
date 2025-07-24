import React, { useState, useEffect } from 'react';
import styles from './WiFiScaleDetector.module.css'; // Asegúrate de que este archivo exista

// --- Define las props esperadas para WiFiScaleDetector ---
interface WiFiScaleDetectorProps {
  onWeightUpdate: (weight: number | null) => void; // Callback para enviar el peso al componente padre
  onConnectionStatusChange?: (isConnected: boolean, deviceName: string | null, error: string | null) => void; // Callback opcional para el estado de conexión
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

  // Función para intentar la conexión y comenzar a leer
  const connectAndReadWiFiScale = async () => {
    setIsConnecting(true);
    setError(null);
    onConnectionStatusChange?.(false, null, 'Conectando...'); // Notifica al padre que se está conectando

    if (!ipAddress) {
      const msg = 'Por favor, ingresa la dirección IP de la báscula Wi-Fi.';
      setError(msg);
      setIsConnecting(false);
      onConnectionStatusChange?.(false, null, msg);
      return;
    }

    try {
      // --- Lógica de conexión y lectura para tu báscula Wi-Fi ---
      // **AQUÍ DEBERÁS ADAPTAR ESTA LÓGICA a la API o protocolo REAL de tu báscula Wi-Fi.**
      // Por ejemplo, haciendo una petición HTTP GET a un endpoint específico de la báscula.
      // Esta es una SIMULACIÓN:
      const response = await fetch(`http://${ipAddress}/weight`, { signal: AbortSignal.timeout(5000) }); // Ejemplo: /weight endpoint
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json(); // Asume que la respuesta es JSON con un campo 'weight'

      if (data && typeof data.weight === 'number') {
        setCurrentWeight(data.weight);
        onWeightUpdate(data.weight); // Notifica al padre el peso inicial
        setIsConnected(true);
        onConnectionStatusChange?.(true, `Báscula Wi-Fi (${ipAddress})`, null); // Notifica éxito de conexión
        setError(null);

        // Inicia la lectura continua después de una conexión exitosa
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(fetchWeight, 1000); // Lee cada segundo (ajusta según necesidad)
      } else {
        throw new Error('Formato de datos de peso inválido recibido.');
      }
    } catch (err) {
      console.error('Error al conectar o leer la báscula Wi-Fi:', err);
      const errMsg = `Error de conexión Wi-Fi: ${(err as Error).message}`;
      setError(errMsg);
      setIsConnected(false);
      onWeightUpdate(null); // Borra el peso en el padre si hay error
      onConnectionStatusChange?.(false, null, errMsg); // Notifica error de conexión
      if (intervalRef.current) clearInterval(intervalRef.current);
    } finally {
      setIsConnecting(false);
    }
  };

  // Función para obtener el peso continuamente
  const fetchWeight = async () => {
    try {
      // Esta función se llamará repetidamente para obtener actualizaciones de peso
      const response = await fetch(`http://${ipAddress}/weight`, { signal: AbortSignal.timeout(3000) });
      if (!response.ok) {
        throw new Error(`Error HTTP en lectura: ${response.status}`);
      }
      const data = await response.json();
      if (data && typeof data.weight === 'number') {
        setCurrentWeight(data.weight);
        onWeightUpdate(data.weight); // Notifica al padre el peso continuo
        setError(null);
      } else {
        setError('Formato de datos de peso inválido en lectura continua.');
        onWeightUpdate(null);
      }
    } catch (err) {
      console.error('Error en lectura continua de báscula Wi-Fi:', err);
      const errMsg = `Error de lectura Wi-Fi: ${(err as Error).message}`;
      setError(errMsg);
      setIsConnected(false); // Asume desconexión por errores persistentes de lectura
      onWeightUpdate(null);
      onConnectionStatusChange?.(false, null, errMsg); // Notifica al padre sobre la desconexión por error
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  // Función para desconectar la báscula Wi-Fi
  const disconnectWiFiScale = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Detiene la lectura continua
    }
    setIsConnected(false);
    setCurrentWeight(null);
    setError(null);
    onWeightUpdate(null); // Borra el peso en el padre
    onConnectionStatusChange?.(false, null, null); // Notifica la desconexión
    console.log('Báscula Wi-Fi desconectada.');
  };

  // Efecto de limpieza al desmontar el componente o cambiar el estado de conexión
  useEffect(() => {
    return () => {
      // Asegura que el intervalo de lectura se detenga cuando el componente se desmonte
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // El array vacío asegura que este efecto se ejecute solo al montar y desmontar

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
            disabled={isConnected || isConnecting} // Deshabilita la edición si ya está conectado o conectando
          />
        </div>

        <div className={styles.buttonsContainer}>
          <button
            onClick={connectAndReadWiFiScale}
            disabled={isConnected || isConnecting || !ipAddress} // Deshabilitado si ya conectado/conectando o sin IP
            className={styles.button}
          >
            {isConnecting ? 'Conectando...' : 'Conectar Wi-Fi'}
          </button>
          <button
            onClick={disconnectWiFiScale}
            disabled={!isConnected && !isConnecting} // Deshabilitado si no está conectado ni intentando conectar
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