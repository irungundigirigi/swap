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
import {setUser} from '../redux/slices/userSlice';
import { setNotification } from '@/redux/slices/notificationSlice';
import { Link } from 'expo-router';
import { useRouter } from "expo-router";
import {fetchAPI} from '../utils/authFetch';



export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch()

  const colorscheme = useColorScheme();
  const router = useRouter();
  const logged_user = useSelector((state) => state.user.user)


  const handleLogin = async () => {
    try {
      const data = await fetchAPI('/auth/login',
         {body: JSON.stringify({email, password}),method: 'POST'}
        );

      (data.token && await AsyncStorage.setItem('authToken', data.token));
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
