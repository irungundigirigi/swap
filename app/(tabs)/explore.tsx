import { StyleSheet, Text,Button, Image, Platform, ScrollView } from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ListCard from '@/components/ItemCard';
import { router } from 'expo-router';

export default function TabTwoScreen() {

  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchItems = async () => {
      
      try {
        // await AsyncStorage.removeItem('authToken')
        const token = await AsyncStorage.getItem('authToken');
        console.log(token)

        if (!token) {
          throw new Error('Authorization token is missing');
        }

        const response = await fetch(`${API_BASE_URL}/api/items`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          },
        });

        if (response.ok) {
          const items = await response.json();
          setItems(items)
          console.log(items);
          // dispatch(setItems(listings)); // Store items in Redux
        } else {
          console.error('Failed to fetch listings:', response.status, response.statusText);
        }

       
        // dispatch(setNotification({ message: "Listings fetched successfully!", type: "success", duration:5000 }))
       

      } catch (err) {
        setError(err.message || "Failed to load items");
      } 
      // finally {
      //   setLoading(false);
      // }
    };

    console.log('Fetching items')
    fetchItems();

   

  }, []);

  return (
    <ScrollView style={styles.ScrollView}>
       <Button title="Add item" onPress={() => router.push('/addItem')} />
      <Text style={styles.title1} >My items</Text>
      <ListCard items ={items} />
    </ScrollView>
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
    fontSize: 20,
    padding: 5
  }
 
});
