
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { Client } from '@googlemaps/google-maps-services-js';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const client = new Client({});

const geocodeAddress = async (address: string) => {
  try {
    const response = await client.geocode({
      params: {
        address: address,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        components: {
            country: 'ZA' // Bias to South Africa
        }
      },
      timeout: 1000, // milliseconds
    });

    if (response.data.results[0]) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
        console.warn(`Geocoding failed for address: ${address}. No results found.`);
        return null;
    }
  } catch (error) {
    console.error(`Error geocoding address "${address}":`, error);
    return null;
  }
};

const processProperties = async () => {
  const filePath = resolve(process.cwd(), 'src', 'data', 'properties.json');
  const properties = JSON.parse(readFileSync(filePath, 'utf-8'));
  
  const geocodedProperties = [];

  for (const prop of properties) {
    if (prop.latitude && prop.longitude) {
        console.log(`Skipping ${prop.address}, already has coordinates.`);
        geocodedProperties.push(prop);
        continue;
    }

    console.log(`Geocoding: ${prop.address}`);
    const location = await geocodeAddress(prop.address);
    
    if (location) {
        geocodedProperties.push({ ...prop, ...location });
    } else {
        geocodedProperties.push(prop); // Keep original if geocoding fails
    }
    // Delay to avoid hitting API rate limits
    await new Promise(resolve => setTimeout(resolve, 200)); 
  }

  writeFileSync(filePath, JSON.stringify(geocodedProperties, null, 2));
  console.log('Geocoding complete. properties.json has been updated.');
};

processProperties();
