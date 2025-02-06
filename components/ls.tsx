import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

export function ListingCard({ listing }) {
  return (
    <View style={styles.listingContainer}>
        <Image source={{ uri: listing.profilePic }} style={styles.profilePic} />
      {/* Profile Section */}
      <View style={styles.listingHeader}>
        
        <View style={styles.userInfo}>
          <Text style={styles.name}>{listing.name}</Text>
          <Text style={styles.username}>@{listing.username}</Text>
        </View>
        <Text style={styles.time}>{listing.time}</Text>
      </View>

      {/* Listing Content */}
      <Text style={styles.caption}>{listing.caption}</Text>
      <Image source={{ uri: listing.image }} style={styles.itemImage} />

      {/* Interaction Buttons */}
      <View style={styles.interactions}>
        <View style={styles.interactionButton}>
          <MaterialCommunityIcons name="comment-outline" size={24} color="black" />
          <Text style={styles.interactionText}>{listing.comments}</Text>
        </View>
        <View style={styles.interactionButton}>
          <Ionicons name="heart-outline" size={24} color="black" />
          <Text style={styles.interactionText}>{listing.likes}</Text>
        </View>
        <View style={styles.interactionButton}>
          <Ionicons name="hand-left-outline" size={24} color="black" />
          <Text style={styles.interactionText}>{listing.offers}</Text>
        </View>
        <View style={styles.interactionButton}>
          <Ionicons name="location-outline" size={24} color="black" />
          <Text style={styles.interactionText}>{listing.location}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listingContainer: {
    fontFamily: 'OutfitRegular',
    display: 'flex',
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    color: "white"
  },
  listingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontFamily: 'OutfitRegular',
    fontSize: 16,
    color: "gray"
  },
  username: {
    color: "gray",
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: "gray",
  },
  caption: {
    marginVertical: 5,
    fontSize: 14,
  },
  itemImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  interactions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  interactionText: {
    marginLeft: 5,
    fontSize: 14,
  },
});

