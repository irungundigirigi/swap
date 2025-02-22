import React,{useState} from 'react';
import { useDispatch, UseDispatch } from 'react-redux';
import { View, Text, Image, FlatList, StyleSheet, Pressable } from 'react-native';
import {reload} from '../redux/slices/itemsSlice';
import { setNotification } from '../redux/slices/notificationSlice';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@/constants/api';
import {authFetch} from '../utils/authFetch';

const ListCard = ({ items }) => {
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const handleItemDelete = async (item_id) => {

        const id = await  JSON.stringify(item_id)
        try {
            const data = await  authFetch('/api/items', {method: 'DELETE', body:JSON.stringify({item_id})});
            dispatch(setNotification({ message: data.message, type: "success", duration: 2000 }));
            dispatch(reload())

      
          } catch (err) {
            setError(err.message || "Failed to delete items");
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