import React, {useState} from 'react';
import { Text,View, Image, TextInput, Button, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { API_BASE_URL } from '@/constants/api';

export function ListingCard({ listing }) {
    console.log(listing);

    const TagList = ({ type, tags = [] }) => (
        <View style={styles.tags}>
            {type === 'swapping' && (
                <View style={styles.swappingForTxt}>
                    <MaterialCommunityIcons name="swap-horizontal" size={24} color="#0582ca" />
                </View>
            )}
            {tags.map((tag, index) => (
                <Text key={index} style={styles.tagHolder}>{tag}</Text>
            ))}
        </View>
    );

    return (
        <View style={styles.listingContainer}>
            <View style={styles.listingInfo}>
                <View style={styles.listingHeader}>
                    <View style={styles.profilePicContainer}>
                        <Image source={{ uri: listing.profile_pic }} style={styles.profilePic} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.name}>{listing.name}</Text>
                        <MaterialIcons name="verified" size={17} color="#ecf39e" />
                    </View>
                    <Text style={styles.username}>{listing.username}</Text>
                </View>

                <View style={styles.caption}>
                    <Text style={styles.captionTxt}>{listing.caption}</Text>
                </View>
                <View style={styles.itemTitleContainer}>
                    <Text style={styles.itemTitle}>{listing.title.toUpperCase()}</Text>
                </View>

                <TagList tags={[listing.condition, ...listing.tag_names]} />

                <View style={styles.itemImagesContainer}>
                    <Image source={{ uri: `${API_BASE_URL}${listing.image[0]}` }} style={styles.itemImage} />
                </View>

                <TagList type='swapping' tags={[listing.exchange_category]} />

                <View style={styles.interactions}>
                    <View style={styles.comments}>
                        <MaterialCommunityIcons name="comment-outline" size={24} color="grey" />
                        <Text style={styles.interactionsLabel}>{listing.comment_count}</Text>
                    </View>
                    <View style={styles.likes}>
                        <Ionicons name="heart-outline" size={24} color="grey" />
                        <Text style={styles.interactionsLabel}>{listing.like_count}</Text>
                    </View>
                    <View style={styles.offers}>
                        <Ionicons name="hand-left-outline" size={24} color="grey" />
                        <Text style={styles.interactionsLabel}>{listing.offer_count}</Text>
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
        borderBottomColor: '#003459',
        borderBottomWidth: 1,
        borderStyle: 'dotted'
    },
    profilePicContainer : {
        
        width: 40,
        height: 40,
        marginRight: 10

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
        alignItems: 'center',
        marginBottom: 5

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
        fontSize:16
    },
    itemTitle: {
        color: '#00a6fb',
        fontFamily: 'OutfitRegular',
        paddingBottom:5
        
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    tagHolder: {
        backgroundColor: '#1d3461',
        fontFamily: 'OutfitRegular',
        color: "#f1f3f9",
        height: 'auto',
        padding:4,
        marginRight: 5,
        borderRadius:4

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
    swappingForTxt: {
        display: 'flex',
        alignItems: 'center',
        color: '#0582ca',
        marginBottom: 0,
        fontFamily: 'OutfitRegular',
        fontSize: 15
    },
    interactions: {
        display: 'flex',
        flexDirection: 'row',
        color: 'grey',
        marginTop: 20,
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