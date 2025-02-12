import React, { useState, useEffect } from 'react';
import { Image, TextInput, Button, StyleSheet, Platform } from 'react-native';
import { API_BASE_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { setNotification } from '@/redux/slices/notificationSlice';
import { Link } from 'expo-router';
import { useRouter } from "expo-router";



export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch()

  const colorscheme = useColorScheme();
  const router = useRouter()

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = await AsyncStorage.getItem('authToken');
      console.log(token)
  
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/validate-token`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
  
          const data = await response.json();
          console.log(data)
  
          if (data.isValid === true) {
            // Token is valid, navigate to tabs
            console.log('valid tkn');
            router.replace('/(tabs)/'); // Use replace to prevent going back
          } else {
            // Token is invalid, remove it and navigate to home
            await AsyncStorage.removeItem('authToken');
            // router.replace('/');
          }
        } catch (error) {
          console.error('Token validation failed:');
          // Handle errors (e.g., network issues)
          await AsyncStorage.removeItem('authToken');
          // router.replace('/');
        }
      }
      //  else {
      //   // No token found, navigate to home
      //   console.log('No token');
      //   router.replace('/(tabs)');
      // }
    };
  
    checkTokenValidity();
  }, []); // Empty dependency array ensures this runs only once on mount


  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      await AsyncStorage.setItem('authToken', data.token);
  
      dispatch(setNotification({ message: "Login successful!", type: "success", duration: 2000 }));
      router.push('/(tabs)/');

    } catch (error) {
      dispatch(setNotification({ message: error.message, type: "error", duration: 2000 }));
    }
  };

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.formContainer}>
        <ThemedText type="defaultSemiBold">LOGIN</ThemedText>
        
        <TextInput
          placeholder="@  Email"
          placeholderTextColor={colorscheme === 'light' ? 'grey' : 'gray'}
          style={colorscheme == 'light'? styles.inputField : styles.inputFieldDark}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={colorscheme == 'light'? styles.inputField : styles.inputFieldDark}
          placeholder="** Password"
          placeholderTextColor={colorscheme === 'light' ? 'grey' : 'gray'} 
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Login" onPress={() => handleLogin()} />
        
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">New here?</ThemedText>
        <ThemedText>
          Tap <ThemedText type="defaultSemiBold">Sign Up</ThemedText> to create a new account.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formContainer: {
    fontFamily:'OutfitRegular',
    gap: 16,
    marginBottom: 24,
    paddingHorizontal: 0,
  },
  inputField: {
    fontFamily:'OutfitRegular',
    color: 'black',
    fontSize: 15,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  inputFieldDark: {
    fontFamily:'OutfitRegular',
    fontSize: 15,
    height: 50,
    borderColor: '#78c6a3',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    color: 'white'
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 20,
  }
});
