import { StyleSheet, Text,Button, View } from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';
import ListCard from '@/components/ItemCard';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
export default function TabTwoScreen() {

  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        throw new Error('Authorization token is missing');
      }

      const response = await fetch(`${API_BASE_URL}/api/items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const items = await response.json();
        setItems(items)
      } else {
        console.error('Failed to fetch listings:', response.status, response.statusText);
      }       

    } catch (err) {
      setError(err.message || "Failed to load items");
    } 
    finally {
      setLoading(false);
    }
  };

  useFocusEffect(() => {
    fetchItems();
  })

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <View style={styles.ScrollView}>
      <Text style={{color:'white', fontSize: 14}}>{loading && 'Fetching items'}</Text>
      <View style={styles.addbtn}>
       <Button  title="Add item" onPress={() => router.push('/addItem')} />
      </View>
      <Text style={styles.title1} >My items</Text>
      <ListCard items ={items} />
    </View>
  );
}

const styles = StyleSheet.create({
  ScrollView: {
    flex: 1,
    padding: 32,
    backgroundColor: '#00171f'
  },
  title1: {
    color: 'white',
    fontFamily: 'OutfitRegular',
    fontSize: 16,
    padding: 10
  },
  addbtn: {
    position: 'absolute',
    top: 0,
    right: 35
  }
 
});
