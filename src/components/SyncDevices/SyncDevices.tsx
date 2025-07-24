import React, { useState } from 'react';
import styles from './SyncDevices.module.css';
import ScaleReaderAll from '../ScaleReaderAll/ScaleReaderAll';
import WiFiScaleDetector from '../WiFiScaleDetector/WiFiScaleDetector';

interface Device {
  id: string;
  name: string;
  isSyncing: boolean;
  lastSync?: string;
  type: 'manual' | 'usb' | 'wifi';
  currentWeight?: number | null;
  isConnected?: boolean;
  connectionError?: string | null;
}

const SyncDevices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([
    { id: 'manual-001', name: 'Balanza Principal (Manual)', isSyncing: false, lastSync: '2025-07-10 14:30', type: 'manual' },
    { id: 'manual-002', name: 'Balanza de Almacén (Manual)', isSyncing: false, lastSync: '2025-07-09 10:00', type: 'manual' },
    { id: 'manual-003', name: 'Balanza de Producción (Manual)', isSyncing: false, type: 'manual' },
  ]);

  const [usbScaleWeight, setUsbScaleWeight] = useState<number | null>(null);
  const [usbScaleStatus, setUsbScaleStatus] = useState<{ isConnected: boolean; deviceName: string | null; error: string | null }>({
    isConnected: false,
    deviceName: null,
    error: null,
  });

  const [wifiScaleWeight, setWifiScaleWeight] = useState<number | null>(null);
  const [wifiScaleStatus, setWifiScaleStatus] = useState<{ isConnected: boolean; deviceName: string | null; error: string | null }>({
    isConnected: false,
    deviceName: null,
    error: null,
  });

  const handleUsbWeightUpdate = (weight: number | null) => {
    setUsbScaleWeight(weight);
  };

  const handleUsbConnectionStatusChange = (isConnected: boolean, deviceName: string | null, error: string | null) => {
    setUsbScaleStatus({ isConnected, deviceName, error });
  };

  const handleWifiWeightUpdate = (weight: number | null) => {
    setWifiScaleWeight(weight);
  };

  const handleWifiConnectionStatusChange = (isConnected: boolean, deviceName: string | null, error: string | null) => {
    setWifiScaleStatus({ isConnected, deviceName, error });
  };

  const handleSyncDevice = (deviceId: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId && device.type === 'manual'
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

      <div className={styles.scaleSection}>
        <h3>Báscula USB</h3>
        <ScaleReaderAll
          onWeightUpdate={handleUsbWeightUpdate}
          onConnectionStatusChange={handleUsbConnectionStatusChange}
          showUI={true}
        />
        {usbScaleStatus.isConnected && (
          <p className={styles.currentReadout}>
            Peso USB: **{usbScaleWeight !== null ? `${usbScaleWeight} kg` : '---'}**
          </p>
        )}
        {usbScaleStatus.error && (
          <p className={styles.errorMessage}>{usbScaleStatus.error}</p>
        )}
      </div>

      <hr className={styles.divider} />

      <div className={styles.scaleSection}>
        <h3>Báscula Wi-Fi</h3>
        <WiFiScaleDetector
          onWeightUpdate={handleWifiWeightUpdate}
          onConnectionStatusChange={handleWifiConnectionStatusChange}
        />
        {wifiScaleStatus.isConnected && (
          <p className={styles.currentReadout}>
            Peso Wi-Fi: **{wifiScaleWeight !== null ? `${wifiScaleWeight} kg` : '---'}**
          </p>
        )}
        {wifiScaleStatus.error && (
          <p className={styles.errorMessage}>{wifiScaleStatus.error}</p>
        )}
      </div>

      <hr className={styles.divider} />

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