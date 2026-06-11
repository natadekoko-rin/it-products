// import * as SecureStore from 'expo-secure-store';
import * as SecureStore from './secureStoreHelper';

const BASE_URL = 'https://dummyjson.com';

interface RequestOptions extends RequestInit {
  body?: any;
}

export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers || {});
  
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = await SecureStore.getItemAsync('user_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  const method = options.method || 'GET';

  if (options.body && !(options.body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  console.log(`\n===[REQUEST]===\nURL: ${method} ${url}`);
  if (options.body) {
    console.log('Payload:', JSON.stringify(options.body, null, 2));
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    
    console.log(`\n===[RESPONSE]===\nStatus: ${response.status} ${response.statusText || ''}\nURL: ${method} ${url}`);
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('===========================\n');

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    
    return data as T;
  } catch (error: any) {
    console.error(`\n===[ERROR]===\nURL: ${method} ${url}\nError:`, error.message || error);
    console.error('===========================\n');
    throw error;
  }
}
