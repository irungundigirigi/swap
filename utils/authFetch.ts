import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '@/constants/api';

const router = useRouter();

const authFetch = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem('authToken');

  if (!token) {
    console.warn('No authentication token found. Redirecting to login...');
    router.replace('/login');  // Redirect user to login
    throw new Error('Authentication required');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};
