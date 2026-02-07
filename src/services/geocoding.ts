// Geocoding service using Nominatim (OpenStreetMap)
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export interface GeocodingResult {
    lat: number;
    lng: number;
    displayName: string;
}

export async function geocodeLocation(
    query: string,
    country: string = 'India'
): Promise<GeocodingResult | null> {
    try {
        const searchQuery = `${query}, ${country}`;
        const url = `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'TerraLens-LCA-App',
            },
        });

        if (!response.ok) {
            throw new Error('Geocoding request failed');
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const result = data[0];
            return {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon),
                displayName: result.display_name,
            };
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

export async function reverseGeocode(
    lat: number,
    lng: number
): Promise<string | null> {
    try {
        const url = `${NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lng}&format=json`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'TerraLens-LCA-App',
            },
        });

        if (!response.ok) {
            throw new Error('Reverse geocoding request failed');
        }

        const data = await response.json();
        return data.display_name || null;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
    }
}
