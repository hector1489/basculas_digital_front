import { useEffect, useRef, useState } from 'react';
import styles from './ScaleReaderAll.module.css';

function ScaleReaderAll() {
  const [weight, setWeight] = useState<number | null>(null);
  const [device, setDevice] = useState<USBDevice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const readingRef = useRef<boolean>(false);

  const connectToScale = async () => {
    if (!('usb' in navigator)) {
      setError('WebUSB no está disponible en este navegador.');
      return;
    }

    try {
      const selectedDevice = await navigator.usb.requestDevice({
        filters: [] //  [{ vendorId: 0x1234, productId: 0x5678 }]
      });

      setDevice(selectedDevice);
      await selectedDevice.open();
      console.log('Dispositivo abierto:', selectedDevice);

      if (selectedDevice.configuration === null) {
        await selectedDevice.selectConfiguration(1);
      }

      await selectedDevice.claimInterface(0);

      setError(null);
      startReading(selectedDevice);
    } catch (err) {
      console.error('Error al conectar con la báscula:', err);
      setError('Error al conectar con la báscula: ' + (err as Error).message);
      setDevice(null);
      setWeight(null);
    }
  };

  const startReading = async (device: USBDevice) => {
    const endpointNumber = 1;
    readingRef.current = true;

    try {
      while (device.opened && readingRef.current) {
        const result = await device.transferIn(endpointNumber, 64);

        if (result.status === 'ok' && result.data) {
          const text = new TextDecoder().decode(result.data);
          console.log('Datos recibidos:', text);

          const match = text.match(/[\d.]+/);
          if (match) {
            const parsedWeight = parseFloat(match[0]);
            if (!isNaN(parsedWeight)) {
              setWeight(parsedWeight);
            }
          }
        } else {
          console.warn('Transferencia no exitosa');
        }

        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (err) {
      console.error('Error al leer datos:', err);
      setError('Error al leer datos de la báscula: ' + (err as Error).message);
    }
  };

  const disconnectScale = async () => {
    readingRef.current = false;

    if (device) {
      try {
        await device.close();
        setDevice(null);
        setWeight(null);
        setError(null);
        console.log('Báscula desconectada.');
      } catch (err) {
        console.error('Error al desconectar la báscula:', err);
        setError('Error al desconectar la báscula: ' + (err as Error).message);
      }
    }
  };

  useEffect(() => {
    return () => {
      readingRef.current = false;
      if (device?.opened) {
        device.close();
      }
    };
  }, [device]);

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