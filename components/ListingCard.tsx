import React, { useState } from 'react';
import { Text, View, Image, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ListingView from './ImageView';
import Feather from '@expo/vector-icons/Feather';
import { API_BASE_URL } from '@/constants/api';
import { useDispatch, useSelector } from "react-redux";

export function ListingCard({ listing }) {
    const userLocation = useSelector((state) => state.user.user.location);

    function getDistanceInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in kilometers
        const toRad = (value) => (value * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    const listingLat = listing.location?.y;
    const listingLon = listing.location?.x;

    const distanceKm = listing.location
        ? getDistanceInKm(userLocation.y, userLocation.x, listingLat, listingLon)
        : null;

    const distanceLabel = distanceKm !== null
        ? distanceKm < 1
            ? `${Math.round(distanceKm * 1000)} m away`
            : `${distanceKm.toFixed(1)} km away`
        : null;

    function getRelativeTime(createdAt) {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = now.getTime() - created.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }

    return (
        <View style={styles.listingContainer}>
            <View style={styles.listingInfo}>
                <View style={styles.listingHeader}>
                    <View style={styles.profilePicContainer}>
                        <Image source={{ uri: listing.user.profile_pic }} style={styles.profilePic} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.name}>{listing.user.name}</Text>
                        <MaterialIcons name="verified" size={17} color="#ecf39e" />
                    </View>
                    <Text style={styles.time}> • {getRelativeTime(listing.created_at)}</Text>
                </View>

                <View style={styles.caption}>
                    {distanceLabel && (
                        <Text style={styles.time}> {distanceLabel}</Text>
                    )}
                    <Text style={styles.captionTxt}>{listing.caption}</Text>
                </View>

                <View style={styles.imageContainer}>
                    <ListingView items={listing.items} />
                </View>

                {/* Render tags
                {listing.items.map((item, index) => (
                    <View key={index} style={styles.tags}>
                        {item.tags && item.tags.map((tag, idx) => (
                            <Text key={idx} style={styles.tagHolder}>{tag}</Text>
                        ))}
                    </View>
                ))} */}

                {/* "Make Offer" Button with Offer Count */}
                <View style={styles.offerSection}>
                    <TouchableOpacity style={styles.makeOfferButton}>
                        <MaterialCommunityIcons name="swap-horizontal" size={26} color="#fff" />
                        <Text style={styles.offerButtonText}></Text>
                    </TouchableOpacity>

                    {/* Show the number of offers */}
                    <View style={styles.offerCountContainer}>
                        <Text style={styles.offerCountText}>{listing.offer_count} Offers</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    listingContainer: {
        color: 'white',
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 20,
        marginBottom: 20,
        borderBottomColor: '#003459',
        borderBottomWidth: 2,
        borderStyle: 'dotted'
    },
    profilePicContainer: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    listingInfo: {
        flexDirection: 'column',
        flex: 9
    },
    listingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    name: {
        display: 'flex',
        alignContent: 'center',
        fontFamily: '',
        color: '#f1faee',
        marginRight: 10
    },
    time: {
        fontFamily: 'OpenSansMedium',
        color: 'grey'
    },
    caption: {
        height: 'auto',
        fontFamily: 'OpenSansMedium',
    },
    captionTxt: {
        height: 'auto',
        fontFamily: 'OpenSansMedium',
        color: 'silver',
        fontSize: 14,
        marginBottom: 10
    },
    imageContainer: {
        width: "100%",
        height: "auto"
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    tagHolder: {
        backgroundColor: '#1d3461',
        fontFamily: 'OpenSansMedium',
        color: "#f1f3f9",
        height: 'auto',
        padding: 4,
        marginRight: 5,
        borderRadius: 4
    },
    makeOfferButton: {
        backgroundColor: '#0582ca',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        width: "auto",
        height: 30,
        borderRadius: 6,
        marginTop: 5
    },
    offerButtonText: {
        color: '#fff',
        fontSize: 13,
        marginLeft: 0
    },
    offerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    offerCountContainer: {
        marginLeft: 10
    },
    offerCountText: {
        color: '#888',
        fontSize: 14
    }
});
