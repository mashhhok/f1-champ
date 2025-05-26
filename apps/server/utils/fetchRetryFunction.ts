import axios from 'axios';

export async function fetchWithRetry<T>(url: string, retries = 3): Promise<T | null> {
    try {
      const response = await axios.get<T>(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429 && retries > 0) {
        console.warn(`Rate limited for ${url}. Retrying (${retries} left)...`);
        return fetchWithRetry<T>(url, retries - 1);
      }
  
      console.error(`Failed to fetch ${url}: ${error.message}`);
      if (retries > 0) {
        return fetchWithRetry<T>(url, retries - 1);
      }
  
      return null;
    }
  }