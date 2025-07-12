import React, { useState } from 'react';

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
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.id === deviceId
            ? { ...device, isSyncing: false, lastSync: new Date().toLocaleString() }
            : device
        )
      );
      alert(`¡${devices.find(d => d.id === deviceId)?.name} sincronizada con éxito!`);
    }, 2000); // 2 segundos de retardo
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Administrador de Balanzas</h2>
      <p>Haz clic en el dispositivo para sincronizar.</p>

      {devices.length === 0 ? (
        <p>No hay dispositivos disponibles para sincronizar.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {devices.map(device => (
            <li
              key={device.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.8rem 1rem',
                margin: '0.5rem 0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: device.isSyncing ? '#e0f7fa' : '#f9f9f9',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>{device.name}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {device.isSyncing ? (
                  <span style={{ color: '#007bff', marginRight: '10px' }}>Sincronizando...</span>
                ) : (
                  <>
                    {device.lastSync && (
                      <span style={{ fontSize: '0.8em', color: '#666', marginRight: '10px' }}>
                        Última sincronización: {device.lastSync}
                      </span>
                    )}
                    <button
                      onClick={() => handleSyncDevice(device.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        opacity: device.isSyncing ? 0.7 : 1,
                      }}
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