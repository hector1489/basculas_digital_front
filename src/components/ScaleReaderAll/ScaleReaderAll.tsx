import { useEffect, useRef, useState } from 'react';
import styles from './ScaleReaderAll.module.css'; // Asegúrate de que este path sea correcto para ScaleReaderAll

// --- 1. Define la interfaz de props para ScaleReaderAll ---
interface ScaleReaderAllProps {
  onWeightUpdate: (weight: number | null) => void; // Callback para enviar el peso al padre
  onConnectionStatusChange?: (isConnected: boolean, deviceName: string | null, error: string | null) => void; // Callback opcional para el estado de conexión
  showUI?: boolean; // Prop opcional para controlar si el componente renderiza su UI
}

// --- 2. Modifica la función del componente para aceptar las props ---
function ScaleReaderAll({ onWeightUpdate, onConnectionStatusChange, showUI = true }: ScaleReaderAllProps) {
  const [weight, setWeight] = useState<number | null>(null);
  const [device, setDevice] = useState<USBDevice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const readingRef = useRef<boolean>(false);

  const connectToScale = async () => {
    if (!('usb' in navigator)) {
      const msg = 'WebUSB no está disponible en este navegador.';
      setError(msg);
      onConnectionStatusChange?.(false, null, msg); // Notifica al padre del error
      return;
    }

    try {
      const selectedDevice = await navigator.usb.requestDevice({
        filters: [] // Puedes añadir filtros específicos aquí, ej: [{ vendorId: 0x1234, productId: 0x5678 }]
      });

      setDevice(selectedDevice);
      await selectedDevice.open();
      console.log('Dispositivo abierto:', selectedDevice);

      if (selectedDevice.configuration === null) {
        await selectedDevice.selectConfiguration(1);
      }

      await selectedDevice.claimInterface(0);

      setError(null);
      onConnectionStatusChange?.(true, selectedDevice.productName || 'Desconocido', null); // Notifica al padre la conexión exitosa
      startReading(selectedDevice);
    } catch (err) {
      console.error('Error al conectar con la báscula:', err);
      const errMsg = 'Error al conectar con la báscula: ' + (err as Error).message;
      setError(errMsg);
      setDevice(null);
      setWeight(null);
      onWeightUpdate(null); // Limpia el peso en el padre si hay error de conexión
      onConnectionStatusChange?.(false, null, errMsg); // Notifica al padre el error de conexión
    }
  };

  const startReading = async (device: USBDevice) => {
    const endpointNumber = 1; // Este número puede variar según la báscula USB
    readingRef.current = true;

    try {
      while (device.opened && readingRef.current) {
        const result = await device.transferIn(endpointNumber, 64); // Lee hasta 64 bytes

        if (result.status === 'ok' && result.data) {
          const text = new TextDecoder().decode(result.data);
          console.log('Datos recibidos:', text);

          const match = text.match(/[\d.]+/); // Busca números y puntos en el texto
          if (match) {
            const parsedWeight = parseFloat(match[0]);
            if (!isNaN(parsedWeight)) {
              setWeight(parsedWeight);       // Actualiza el estado interno
              onWeightUpdate(parsedWeight);  // **3. Llama al callback para notificar al padre**
            }
          }
        } else {
          console.warn('Transferencia no exitosa o sin datos.');
          setWeight(null); // Limpia el peso si la transferencia falla
          onWeightUpdate(null); // Notifica al padre para limpiar el peso
        }

        await new Promise(resolve => setTimeout(resolve, 200)); // Pequeño retardo
      }
    } catch (err) {
      console.error('Error al leer datos:', err);
      const errMsg = 'Error al leer datos de la báscula: ' + (err as Error).message;
      setError(errMsg);
      setWeight(null);       // Limpia el estado interno
      onWeightUpdate(null);  // Notifica al padre para limpiar el peso
      onConnectionStatusChange?.(false, device.productName || 'Desconocido', errMsg); // Notifica al padre del error en lectura
    }
  };

  const disconnectScale = async () => {
    readingRef.current = false; // Detiene el bucle de lectura

    if (device) {
      try {
        await device.close();
        console.log('Báscula desconectada.');
        setDevice(null);
        setWeight(null);
        setError(null);
        onWeightUpdate(null); // Notifica al padre para limpiar el peso
        onConnectionStatusChange?.(false, null, null); // Notifica al padre la desconexión
      } catch (err) {
        console.error('Error al desconectar la báscula:', err);
        const errMsg = 'Error al desconectar la báscula: ' + (err as Error).message;
        setError(errMsg);
        // Si hay un error al cerrar, quizás el dispositivo sigue "lógicamente" conectado pero con problemas
        onConnectionStatusChange?.(true, device.productName || 'Desconocido', errMsg);
      }
    }
  };

  useEffect(() => {
    return () => {
      readingRef.current = false; // Asegura que el bucle de lectura se detenga al desmontar
      if (device?.opened) {
        // Cierre seguro del dispositivo si está abierto
        device.close().catch(e => console.error("Error al cerrar el dispositivo al desmontar:", e));
      }
    };
  }, [device]); // Este efecto se ejecuta cuando el objeto 'device' cambia

  // --- 4. Renderizado condicional de la UI basada en la prop 'showUI' ---
  if (!showUI) {
    // Si showUI es false, el componente no renderiza nada visible, solo maneja la lógica
    return null;
  }

  return (
     <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Lector de Báscula USB</h1>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.buttonsContainer}>
          <button
            onClick={connectToScale}
            disabled={device !== null}
            className={styles.button}
          >
            Conectar Báscula
          </button>
          <button
            onClick={disconnectScale}
            disabled={device === null}
            className={styles.button}
          >
            Desconectar Báscula
          </button>
        </div>

        {device && (
          <p className={`${styles.statusMessage} ${styles.connected}`}>
            Báscula conectada: {device.productName || 'Desconocido'}
          </p>
        )}
        {!device && !error && (
            <p className={`${styles.statusMessage} ${styles.disconnected}`}>
                Báscula desconectada
            </p>
        )}

        {weight !== null ? (
          <p className={styles.weightDisplay}>
            Peso actual: {weight} kg
          </p>
        ) : (
          device && <p className={styles.statusMessage}>Esperando peso...</p>
        )}
      </div>
    </div>
  );
}

export default ScaleReaderAll;