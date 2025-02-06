import React, { useState, useEffect } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";
import { clearNotification } from "@/redux/slices/notificationSlice";

const paddingTop = Constants.statusBarHeight + 45;

const Notification = ({ message, type = "", duration = 3000 }) => {
  const dispatch = useDispatch();
  
  // Animated values
  const fadeAnim = useState(new Animated.Value(0))[0]; // Start invisible
  const translateY = useState(new Animated.Value(-20))[0]; // Start slightly above

  useEffect(() => {
    // Animate entry: Fade in & Slide down
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after `duration`
    const timer = setTimeout(() => {
      // Animate exit: Fade out & Slide up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        dispatch(clearNotification()); // Remove from Redux store
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, translateY, duration, dispatch]);

  return (
    <Animated.View
      style={[
        styles.container,
        styles[type],
        { 
          opacity: fadeAnim, 
          transform: [{ translateY }] 
        }
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    top: 0,
    left: 0,
    padding: 10,
    marginTop: paddingTop,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  text: {
    color: "white",
    fontFamily: "OutfitRegular",
  },
  success: {
    backgroundColor: "#4CAF50", // Green
  },
  warning: {
    backgroundColor: "#FFC107", // Yellow
  },
  info: {
    backgroundColor: "#2196F3", // Blue
  },
  error: {
    backgroundColor: "#F44336", // Red
  },
});

export default Notification;
