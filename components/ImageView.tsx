import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Text,
} from "react-native";

import { API_BASE_URL } from "@/constants/api";

const ListingView = ({ items }) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Store the selected item

  const openImage = (item) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const closeImage = () => {
    setVisible(false);
    setSelectedItem(null); // Clear the selected item
  };

  const renderImage = (item, style, index, isLast = false, remaining = 0) => {
    const uri = `${API_BASE_URL}${item?.image[0]}`;
    return (
      <TouchableOpacity key={index} onPress={() => openImage(item)} style={style}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri }} style={styles.image} />
          {isLast && remaining > 0 && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>+{remaining}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Count the number of items
  const count = items.length;

  return (
    <>
      {count === 1 && (
        <View style={styles.container}>
          {renderImage(items[0], styles.singleImage, 0)}
        </View>
      )}

      {count === 2 && (
        <View style={styles.containerRow}>
          {items.map((item, index) =>
            renderImage(item, [
              styles.halfImage,
              index === 0 ? { marginRight: 2 } : { marginLeft: 2 },
            ], index)
          )}
        </View>
      )}

      {count === 3 && (
        <View style={styles.container}>
          <View style={{ flex: 1, marginBottom: 2 }}>
            {renderImage(items[0], styles.flexFill, 0)}
          </View>
          <View style={styles.row}>
            {renderImage(items[1], [styles.flexFill, { marginRight: 2 }], 1)}
            {renderImage(items[2], [styles.flexFill, { marginLeft: 2 }], 2)}
          </View>
        </View>
      )}

      {count >= 4 && (
        <View style={styles.grid}>
          {items.slice(0, 4).map((item, index) =>
            renderImage(
              item,
              [
                styles.quarterImage,
                {
                  marginRight: index % 2 === 0 ? 2 : 0,
                  marginLeft: index % 2 === 1 ? 2 : 0,
                  marginBottom: index < 2 ? 2 : 0,
                },
              ],
              index,
              index === 3,
              count - 4
            )
          )}
        </View>
      )}

      {/* Modal for displaying the selected item */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image source={{ uri: `${API_BASE_URL}${selectedItem?.image[0]}` }} style={styles.modalImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{selectedItem?.title}</Text>
              <Text style={styles.itemDescription}>{selectedItem?.description}</Text>
              <Text style={styles.itemCondition}>Condition: {selectedItem?.condition}</Text>
              <View style={styles.itemTags}>
                {selectedItem?.tags.map((tag, index) => (
                  <Text key={index} style={styles.itemTag}>
                    #{tag}
                  </Text>
                ))}
              </View>
            </View>
            <Pressable onPress={closeImage} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 2,
    
  },
  containerRow: {
    flexDirection: "row",
    width: "100%",
    aspectRatio: 2,
  },
  row: {
    flexDirection: "row",
    flex: 1,
  },
  singleImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  halfImage: {
    flex: 1,
    height: "100%",
    borderRadius: 8,
  },
  flexFill: {
    flex: 1,
    height: "100%",
    borderRadius: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    aspectRatio: 1,
  },
  quarterImage: {
    width: "49%",
    height: "49%",
    borderRadius: 8,
  },
  imageWrapper: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  overlayText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: 'OutfitRegular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000dd",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    maxWidth: 400,
    width: "80%",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 8,
  },
  itemDetails: {
    marginTop: 15,
    textAlign: "center",
    fontFamily: 'OutfitRegular',
  },
  itemTitle: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'OutfitRegular',
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
    fontFamily: 'OutfitRegular',
  },
  itemCondition: {
    fontSize: 14,
    color: "#999",
    fontFamily: 'OutfitRegular',
  },
  itemTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  itemTag: {
    fontSize: 12,
    backgroundColor: "#f1f1f1",
    padding: 5,
    borderRadius: 5,
    margin: 3,
    fontFamily: 'OutfitRegular',
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ffffffaa",
    borderRadius: 20,
    padding: 10,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ListingView;
