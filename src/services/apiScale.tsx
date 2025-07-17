interface ScaleDevice {
  id: string;
  name: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'calibrating';
  lastReading?: number;
}

const BASE_URL = 'https://api.scale.com/';

export async function findWifiScales(): Promise<ScaleDevice[]> {
  try {
    const response = await fetch(`${BASE_URL}devices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_AUTH_TOKEN'
      },
    });

    if (!response.ok) {
      const errorDetail = await response.json();
      throw new Error(`Error al buscar balanzas Wi-Fi: ${response.status} - ${errorDetail.message || response.statusText}`);
    }

    const scales: ScaleDevice[] = await response.json();
    console.log('Balanzas Wi-Fi encontradas:', scales);
    return scales;
  } catch (error) {
    console.error('Fallo al buscar balanzas Wi-Fi:', error);
    throw error;
  }
}
