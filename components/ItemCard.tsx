import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListCard = ({ items }) => {

    const handleItemDelete = async (item_id) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
      
            if (!token) {
              throw new Error('Authorization token is missing');
            }


      
            const response = await fetch(`${API_BASE_URL}/api/items`, {
              method: 'DELETE',
              body: JSON.stringify({item_id: item_id}),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });
      
            if (response.ok) {
              const response = await response.json();
            } else {
              console.error('Failed to DElete item', response.status, response.statusText);
            }       
      
          } catch (err) {
            setError(err.message || "Failed to load items");
          } 

    };

    return (
        <FlatList
            data={items}
            keyExtractor={(item) => item.item_id}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Image source={{ uri: `${API_BASE_URL}${item.image[0]}` }} style={styles.image} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.condition}>{item.condition.toUpperCase()}</Text>
                        <View style={styles.tagsContainer}>
                            {item.tag_names.filter(tag => tag).map((tag, index) => (
                                <Text key={index} style={styles.tag}>{tag}</Text>
                            ))}
                        </View>
                        <Pressable style={{position:'absolute',right:5, top: 1}} onPress={() =>handleItemDelete(item.item_id)}>
                            <Ionicons name="remove-circle" size={24} color="white" />
                        </Pressable>
                    </View>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        position: 'relative',
        // backgroundColor: '#fff',
        borderRadius: 8,
        // shadowColor: '#000',
        // shadowOpacity: 0.1,
        // shadowRadius: 5,
        // elevation: 3,
        alignItems: 'center',

    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 6,
        marginRight: 10,
    },
    infoContainer: {
        
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontFamily: 'OutfitRegular',
        color: '#0582ca',   
    },
    description: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'OutfitRegular',
    },
    condition: {
        fontSize: 12,
        color: '#0582ca',
        fontFamily: 'OutfitRegular',
        marginTop: 2
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    tag: {
        backgroundColor: '#1d3461',
        color: '#fff',
        fontSize: 12,
        padding: 4,
        borderRadius: 4,
        marginRight: 5,
        fontFamily: 'OutfitRegular',

    },
});

export default ListCard;