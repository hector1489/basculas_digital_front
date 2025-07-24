import { useEffect, useRef, useState } from 'react';
import styles from './ScaleReader.module.css';

// --- Define the props for ScaleReader ---
interface ScaleReaderProps {
  onWeightUpdate: (weight: number | null) => void; // Callback to send weight to parent
  onConnectionStatusChange?: (isConnected: boolean, deviceName: string | null, error: string | null) => void; // Optional callback for connection status
  showUI?: boolean; // Optional prop to control if the component renders its own UI (buttons, weight display)
}

function ScaleReader({ onWeightUpdate, onConnectionStatusChange, showUI = true }: ScaleReaderProps) {
  const [weight, setWeight] = useState<number | null>(null);
  const [device, setDevice] = useState<USBDevice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const readingRef = useRef<boolean>(false);

  // --- Connection Logic ---
  const connectToScale = async () => {
    if (!('usb' in navigator)) {
      const msg = 'WebUSB no está disponible en este navegador.';
      setError(msg);
      onConnectionStatusChange?.(false, null, msg); // Notify parent of error
      return;
    }

    try {
      const selectedDevice = await navigator.usb.requestDevice({
        filters: [] // You can add specific vendorId/productId here if known
      });

      setDevice(selectedDevice);
      await selectedDevice.open();
      console.log('Dispositivo abierto:', selectedDevice);

      if (selectedDevice.configuration === null) {
        await selectedDevice.selectConfiguration(1);
      }

      await selectedDevice.claimInterface(0);

      setError(null);
      onConnectionStatusChange?.(true, selectedDevice.productName || 'Desconocido', null); // Notify parent of success
      startReading(selectedDevice);
    } catch (err) {
      console.error('Error al conectar con la báscula:', err);
      const errMsg = 'Error al conectar con la báscula: ' + (err as Error).message;
      setError(errMsg);
      setDevice(null);
      setWeight(null);
      onWeightUpdate(null); // Clear weight on error
      onConnectionStatusChange?.(false, null, errMsg); // Notify parent of error
    }
  };

  // --- Reading Data Logic ---
  const startReading = async (device: USBDevice) => {
    const endpointNumber = 1; // This might vary depending on the scale
    readingRef.current = true;

    try {
      // Loop while the device is open and reading is active
      while (device.opened && readingRef.current) {
        const result = await device.transferIn(endpointNumber, 64); // Read up to 64 bytes

        if (result.status === 'ok' && result.data) {
          const text = new TextDecoder().decode(result.data);
          console.log('Datos recibidos:', text);

          // Extract numerical value from the received text
          const match = text.match(/[\d.]+/);
          if (match) {
            const parsedWeight = parseFloat(match[0]);
            if (!isNaN(parsedWeight)) {
              setWeight(parsedWeight);       // Update internal state
              onWeightUpdate(parsedWeight);  // **Notify parent with the new weight**
            }
          }
        } else {
          console.warn('Transferencia no exitosa o sin datos.');
          setWeight(null); // Clear weight if transfer fails
          onWeightUpdate(null); // Notify parent to clear weight
        }

        await new Promise(resolve => setTimeout(resolve, 200)); // Short delay
      }
    } catch (err) {
      console.error('Error al leer datos:', err);
      const errMsg = 'Error al leer datos de la báscula: ' + (err as Error).message;
      setError(errMsg);
      setWeight(null);       // Clear internal state
      onWeightUpdate(null);  // Notify parent to clear weight
      onConnectionStatusChange?.(false, device.productName || 'Desconocido', errMsg); // Notify parent of error
    }
  };

  // --- Disconnection Logic ---
  const disconnectScale = async () => {
    readingRef.current = false; // Stop the reading loop

    if (device) {
      try {
        await device.close();
        console.log('Báscula desconectada.');
        setDevice(null);
        setWeight(null);
        setError(null);
        onWeightUpdate(null); // Notify parent to clear weight
        onConnectionStatusChange?.(false, null, null); // Notify parent of disconnection
      } catch (err) {
        console.error('Error al desconectar la báscula:', err);
        const errMsg = 'Error al desconectar la báscula: ' + (err as Error).message;
        setError(errMsg);
        onConnectionStatusChange?.(true, device.productName || 'Desconocido', errMsg); // Keep status as connected with error
      }
    }
  };

  // --- Cleanup on component unmount or device change ---
  useEffect(() => {
    return () => {
      readingRef.current = false; // Ensure reading loop stops
      if (device?.opened) {
        // Use a safe check to prevent errors if device is already closed
        device.close().catch(e => console.error("Error closing device on unmount:", e));
      }
    };
  }, [device]); // Re-run effect if 'device' object changes

  // --- UI Rendering (Conditional based on 'showUI' prop) ---
  if (!showUI) {
    // If showUI is false, render nothing visibly, just handle the logic
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

export default ScaleReader;