import axios from 'axios';
import { mockApiService, USE_MOCK_API } from './mockApi';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token en cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores globales aquí si es necesario
    return Promise.reject(error);
  }
);

// Wrapper del cliente API que puede usar mock o real según configuración
export const api = {
  async post(url: string, data: any) {
    if (USE_MOCK_API) {
      console.log('🔧 Usando Mock API para:', url);

      // Redirigir a los servicios mock según la URL
      if (url.includes('/Auth/login')) {
        const response = await mockApiService.login(data);
        return { data: response };
      }

      if (url.includes('/Auth/register')) {
        const response = await mockApiService.register(data);
        return { data: response };
      }

      // Para otras URLs, simular una respuesta genérica
      return { data: { message: 'Mock response', data } };
    }

    // Usar el cliente real de axios
    return apiClient.post(url, data);
  },

  async get(url: string) {
    if (USE_MOCK_API) {
      console.log('🔧 Usando Mock API para:', url);

      if (url.includes('/Auth/me') || url.includes('/user/current')) {
        const response = await mockApiService.getCurrentUser();
        return { data: response };
      }

      return { data: { message: 'Mock response' } };
    }

    return apiClient.get(url);
  },

  async put(url: string, data: any) {
    if (USE_MOCK_API) {
      console.log('🔧 Usando Mock API para:', url);
      return { data: { message: 'Mock response', data } };
    }

    return apiClient.put(url, data);
  },

  async delete(url: string) {
    if (USE_MOCK_API) {
      console.log('🔧 Usando Mock API para:', url);
      return { data: { message: 'Mock response' } };
    }

    return apiClient.delete(url);
  },
};

export default apiClient;

