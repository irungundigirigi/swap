import { StyleSheet, Text,Button,ActivityIndicator, View } from 'react-native';
import React, {useEffect, useState} from 'react';
import ListCard from '@/components/ItemCard';
import { router } from 'expo-router';
import { setItems } from '@/redux/slices/itemsSlice';
import { setLoading, setLoadingMessage} from '../../redux/slices/loadingSlice'
import { useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { authFetch } from '../../utils/authFetch';
import RoundPressable from '../../components/RoundPressable';
export default function TabTwoScreen() {

  const [error, setError] = useState('');

  const dispatch = useDispatch()
  const items = useSelector((state) => state.items.items);
  const Fetch = useSelector((state) => state.items.fetchItems);
  const loading = useSelector((state) => state.loader.loading);
  const loadingMessage = useSelector((state) => state.loader.message);


  const fetchItems = async () => {
    dispatch(setLoading(true));
    dispatch(setLoadingMessage('Fetching items...'));
    try {
      const items = await authFetch('/api/items', { method: 'GET' });
      dispatch(setItems(items));
    } catch (err) {
      console.error("Error loading items", err);
    } finally {
      dispatch(setLoading(false));
      dispatch(setLoadingMessage(''));
    }
  };

  useEffect(() => {
    fetchItems();
  }, [Fetch]);

  return (
    <>
       {loading && (
        <View style={{ position: 'absolute', left: '50%', top: 30, zIndex: 10 }}>
          <ActivityIndicator size='large' color='blue' />
          <Text style={{color:'silver'}}>{loadingMessage}</Text>
        </View>
      )}
      
      <View style={{position:'absolute', right: 35, top: 20, zIndex:10}}> 
        <RoundPressable onPress={() => router.push('addItem')} iconName='add-outline'></RoundPressable>
      </View>
  
    <View style={styles.ScrollView}>
      <Text style={{color:'white', fontSize: 14}}>{loading && 'Fetching items'}</Text>
      <Text style={styles.title1} >My items</Text>
      {items.length > 0 && <ListCard items ={items} />}
    </View>
    </>
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
