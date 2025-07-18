import React, { useState } from 'react';
import styles from './SyncDevices.module.css';
import ScaleReader from '../ScaleReader/ScaleReader';

interface Device {
  id: string;
  name: string;
  isSyncing: boolean;
  lastSync?: string;
}

const SyncDevices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([
    { id: 'scale-001', name: 'Balanza Principal', isSyncing: false, lastSync: '2025-07-10 14:30' },
    { id: 'scale-002', name: 'Balanza de Almacén', isSyncing: false, lastSync: '2025-07-09 10:00' },
    { id: 'scale-003', name: 'Balanza de Producción', isSyncing: false },
  ]);

  const handleSyncDevice = (deviceId: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId
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
      <p>Haz clic en el botón "Sincronizar" para actualizar el estado del dispositivo.</p>

      <ScaleReader />


      {devices.length === 0 ? (
        <p className={styles.noDevicesMessage}>No hay dispositivos disponibles para sincronizar.</p>
      ) : (
        <ul className={styles.deviceList}>
          {devices.map(device => (
            <li
              key={device.id}
              className={`${styles.deviceItem} ${device.isSyncing ? styles.syncing : ''}`}
            >
              <span className={styles.deviceName}>{device.name}</span>
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
                    <button
                      onClick={() => handleSyncDevice(device.id)}
                      className={styles.syncButton}
                      disabled={device.isSyncing}
                    >
                      Sincronizar
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SyncDevices;