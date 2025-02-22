import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../constants/api'
import { router } from 'expo-router';

const processResponse = async(response) => {
  const data = await response.json();
  if (!response.ok) {
    console.log(data.message || 'Request failed');
  }
  return data;
}

const fetchAPI = async (endpoint, options = {}) => {  
  const headers = {
    ...options.headers,
    // Authorization: `Bearer ${token}`, 
    'Content-Type': 'application/json',
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  return processResponse(response);
};
const authFetch = async (endpoint, options ={}) => {
  const token = await AsyncStorage.getItem('authToken');

  if (!token) {
        console.warn('No authentication token found. Redirecting to login...');
        router.push('/');
        throw new Error('Authentication required');
  }
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`, 
    'Content-Type': 'application/json',
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  return processResponse(response);
}
const authImageFetch = async (endpoint, options ={}) => {
  let token = await AsyncStorage.getItem('authToken');

  if (!token) {
        console.warn('No authentication token found. Redirecting to login...');
        router.push('/');
        throw new Error('Authentication required');
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}` ,
    'Content-Type': 'multipart/form-data'
  };

  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers,
  });
  return processResponse(response);
}

export {fetchAPI,authImageFetch, authFetch};

