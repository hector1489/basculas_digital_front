import React, { useState } from 'react';
import styles from './SyncDevices.module.css';
import ScaleReaderAll from '../ScaleReaderAll/ScaleReaderAll'; // Para básculas USB
import WiFiScaleDetector from '../WiFiScaleDetector/WiFiScaleDetector'; // Para básculas Wi-Fi

// Ampliamos la interfaz Device para incluir el tipo y estados de conexión/peso
interface Device {
  id: string;
  name: string;
  isSyncing: boolean;
  lastSync?: string;
  type: 'manual' | 'usb' | 'wifi'; // Define el tipo de dispositivo
  currentWeight?: number | null;   // Opcional: para mostrar el peso si se guarda en el estado de devices
  isConnected?: boolean;           // Opcional: para mostrar el estado de conexión individual
  connectionError?: string | null; // Opcional: para mostrar errores individuales
}

const SyncDevices: React.FC = () => {
  // Inicializamos dispositivos. He añadido el tipo 'manual' a los existentes.
  const [devices, setDevices] = useState<Device[]>([
    { id: 'manual-001', name: 'Balanza Principal (Manual)', isSyncing: false, lastSync: '2025-07-10 14:30', type: 'manual' },
    { id: 'manual-002', name: 'Balanza de Almacén (Manual)', isSyncing: false, lastSync: '2025-07-09 10:00', type: 'manual' },
    { id: 'manual-003', name: 'Balanza de Producción (Manual)', isSyncing: false, type: 'manual' },
  ]);

  // Estados para manejar los datos de la báscula USB
  const [usbScaleWeight, setUsbScaleWeight] = useState<number | null>(null);
  const [usbScaleStatus, setUsbScaleStatus] = useState<{ isConnected: boolean; deviceName: string | null; error: string | null }>({
    isConnected: false,
    deviceName: null,
    error: null,
  });

  // Estados para manejar los datos de la báscula Wi-Fi
  const [wifiScaleWeight, setWifiScaleWeight] = useState<number | null>(null);
  const [wifiScaleStatus, setWifiScaleStatus] = useState<{ isConnected: boolean; deviceName: string | null; error: string | null }>({
    isConnected: false,
    deviceName: null,
    error: null,
  });

  // Callback para recibir actualizaciones de peso de la báscula USB
  const handleUsbWeightUpdate = (weight: number | null) => {
    setUsbScaleWeight(weight);
  };

  // Callback para recibir el estado de conexión de la báscula USB
  const handleUsbConnectionStatusChange = (isConnected: boolean, deviceName: string | null, error: string | null) => {
    setUsbScaleStatus({ isConnected, deviceName, error });
  };

  // Callback para recibir actualizaciones de peso de la báscula Wi-Fi
  const handleWifiWeightUpdate = (weight: number | null) => {
    setWifiScaleWeight(weight);
  };

  // Callback para recibir el estado de conexión de la báscula Wi-Fi
  const handleWifiConnectionStatusChange = (isConnected: boolean, deviceName: string | null, error: string | null) => {
    setWifiScaleStatus({ isConnected, deviceName, error });
  };

  // La función handleSyncDevice original se mantiene para los dispositivos 'manuales'
  const handleSyncDevice = (deviceId: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId && device.type === 'manual' // Solo sincroniza si es de tipo manual
          ? { ...device, isSyncing: true }
          : device
      )
    );

    setTimeout(() => {
      setDevices(prevDevices => {
        const syncedDevice = prevDevices.find(d => d.id === deviceId);
        alert(`¡${syncedDevice?.name || 'Dispositivo'} sincronizada con éxito!`);
        return prevDevices.map(device =>
          device.id === deviceId
            ? { ...device, isSyncing: false, lastSync: new Date().toLocaleString() }
            : device
        );
      });
    }, 2000);
  };

  return (
    <div className={styles.syncDevicesContainer}>
      <h2>Administrador de Balanzas</h2>
      <p>Conecta y gestiona tus básculas USB y Wi-Fi. También puedes sincronizar manualmente los dispositivos registrados.</p>

      {/* --- Sección para la Báscula USB --- */}
      <div className={styles.scaleSection}>
        <h3>Báscula USB</h3>
        {/* Renderiza el componente ScaleReaderAll y le pasa los callbacks */}
        <ScaleReaderAll
          onWeightUpdate={handleUsbWeightUpdate}
          onConnectionStatusChange={handleUsbConnectionStatusChange}
          showUI={true} // Mostrar la interfaz de usuario de ScaleReaderAll
        />
        {/* Muestra el peso y estado de la báscula USB */}
        {usbScaleStatus.isConnected && (
          <p className={styles.currentReadout}>
            Peso USB: **{usbScaleWeight !== null ? `${usbScaleWeight} kg` : '---'}**
          </p>
        )}
        {usbScaleStatus.error && (
            <p className={styles.errorMessage}>{usbScaleStatus.error}</p>
        )}
      </div>

      <hr className={styles.divider} /> {/* Separador visual */}

      {/* --- Sección para la Báscula Wi-Fi --- */}
      <div className={styles.scaleSection}>
        <h3>Báscula Wi-Fi</h3>
        {/* Renderiza el componente WiFiScaleDetector y le pasa los callbacks */}
        <WiFiScaleDetector
          onWeightUpdate={handleWifiWeightUpdate}
          onConnectionStatusChange={handleWifiConnectionStatusChange}
          // No necesitamos onScaleFound aquí porque el componente ya no la usa ni la advertencia está activa.
        />
        {/* Muestra el peso y estado de la báscula Wi-Fi */}
        {wifiScaleStatus.isConnected && (
          <p className={styles.currentReadout}>
            Peso Wi-Fi: **{wifiScaleWeight !== null ? `${wifiScaleWeight} kg` : '---'}**
          </p>
        )}
         {wifiScaleStatus.error && (
            <p className={styles.errorMessage}>{wifiScaleStatus.error}</p>
        )}
      </div>

      <hr className={styles.divider} /> {/* Separador visual */}

      {/* --- Sección de Dispositivos Registrados (Manuales) --- */}
      <h3 className={styles.sectionTitle}>Dispositivos Registrados</h3>
      {devices.length === 0 ? (
        <p className={styles.noDevicesMessage}>No hay dispositivos disponibles para sincronizar.</p>
      ) : (
        <ul className={styles.deviceList}>
          {devices.map(device => (
            <li
              key={device.id}
              className={`${styles.deviceItem} ${device.isSyncing ? styles.syncing : ''}`}
            >
              <span className={styles.deviceName}>
                {device.name}
                {/* Puedes añadir indicadores visuales para básculas conectadas si estas se añaden dinámicamente a la lista */}
                {/* Ejemplo: Si tuvieras una forma de asociar el dispositivo de la lista con la conexión real */}
                {/* {device.type === 'usb' && usbScaleStatus.isConnected && <span className={styles.connectedIndicator}> (USB Conectada)</span>} */}
                {/* {device.type === 'wifi' && wifiScaleStatus.isConnected && <span className={styles.connectedIndicator}> (Wi-Fi Conectada)</span>} */}
              </span>
              <div className={styles.deviceActions}>
                {device.isSyncing ? (
                  <span className={styles.syncingStatus}>Sincronizando...</span>
                ) : (
                  <>
                    {device.lastSync && (
                      <span className={styles.lastSyncInfo}>
                        Última sincronización: {device.lastSync}
                      </span>
                    )}
                    {/* El botón "Sincronizar" solo es relevante para dispositivos manuales o de registro */}
                    {device.type === 'manual' && (
                        <button
                        onClick={() => handleSyncDevice(device.id)}
                        className={styles.syncButton}
                        disabled={device.isSyncing}
                        >
                        Sincronizar
                        </button>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* --- Peso General Actual (Prioriza USB sobre Wi-Fi) --- */}
      <div className={styles.overallWeightDisplay}>
          <h4>Peso General Actual:</h4>
          {usbScaleStatus.isConnected && usbScaleWeight !== null ? (
              <p className={styles.finalWeight}>**{usbScaleWeight} kg (USB)**</p>
          ) : wifiScaleStatus.isConnected && wifiScaleWeight !== null ? (
              <p className={styles.finalWeight}>**{wifiScaleWeight} kg (Wi-Fi)**</p>
          ) : (
              <p className={styles.finalWeight}>--.-- kg</p>
          )}
      </div>
    </div>
  );
};

export default SyncDevices;