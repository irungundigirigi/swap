import React, {useState} from 'react';
import { Text,View, Image, TextInput, Button, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';

export function ListingCard({listing}) {
    return(
        <View style={styles.listingContainer}>
        <View style={styles.profilePicContainer}>
         <Image source={{ uri: listing.profilePic }} style={styles.profilePic} />
        </View>
        <View style={styles.listingInfo}>
        <View style={styles.listingHeader}>
            <Text style={styles.name}>
                {listing.name}
                <MaterialIcons name="verified" size={17} color="#ecf39e" />
                 </Text>
            <Text style={styles.username}>{listing.username}</Text>
            <Text style={styles.time}>{listing.time}</Text>
        </View>
        
            <View style={styles.caption}><Text style={styles.captionTxt}>
                {listing.caption}</Text></View>
            <View style={styles.itemImagesContainer}>
                <Image source={{ uri: listing.image }} style={styles.itemImage} />
            </View>
            <View style={styles.interactions}>
                <View style={styles.comments}>
                    <MaterialCommunityIcons name="comment-outline" size={24} color="grey" /> 
                    <Text style={styles.interactionsLabel}>{listing.comments}</Text>
                </View>
                <View style={styles.likes}>
                    <Ionicons name="heart-outline" size={24} color="grey" />
                    <Text style={styles.interactionsLabel}>{listing.likes}</Text>
                </View>
                <View style={styles.offers}>
                    <Ionicons name="hand-left-outline" size={24} color="grey" />
                    <Text style={styles.interactionsLabel}>{listing.offers}</Text>

                </View>
                <View style={styles.location}>
                    <Feather name="map-pin" size={22} color="grey" />
                    <Text style={styles.interactionsLabel}>{listing.location}</Text>
                </View>
            </View>
        </View>
        
    </View>
);
}

const styles = StyleSheet.create({
    listingContainer : {
        color: 'white',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 20,
        borderBottomColor: '#778da9',
        borderBottomWidth: 0.5
    },
    profilePicContainer : {
        flex: 1,
        width: 4,
        height: 40,
        marginRight: 20

    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
      },
    listingInfo : {
        flexDirection: 'column',
        flex: 9
    },
    listingHeader : {
        flexDirection: 'row',
        alignItems: 'center'

    },
    name : {
        display: 'flex',
        alignContent: 'center',
        fontFamily: 'OutfitRegular',
        color: '#f1faee',
        marginRight: 10

    },
    username: {
        fontFamily: 'OutfitRegular',
        color: 'grey',
        marginRight: 10

    },
    time: {
        fontFamily: 'OutfitRegular',
        color: 'grey'
    },
    caption: {
        height:'auto',
        fontFamily: 'OutfitRegular',
      

    },
    captionTxt: {
        height:'auto',
        fontFamily: 'OutfitRegular',
        color: '#f1faee',
        fontSize:15
    },
    itemImagesContainer: {
        height: 170,
        width: '100%',
        borderRadius: 10
    },
    itemImage: {
        height: 150,
        width: "100%",
        borderRadius: 10,
        marginTop: 10

    },
    interactions: {
        display: 'flex',
        flexDirection: 'row',
        color: 'grey',
        marginBottom: 30

    },
    comments: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20
    },
    likes: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20
    },
    offers: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20
    },
    location: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20
    },
    interactionsLabel: {
        marginLeft: 3,
        color: "grey"
    }

})