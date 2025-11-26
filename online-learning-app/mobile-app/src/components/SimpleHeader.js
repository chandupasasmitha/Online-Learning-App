import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SimpleHeader = ({ title, onBackPress, rightIcon, onRightPress }) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0066CC" />
      <LinearGradient
        colors={["#007AFF", "#0066CC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Icon name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>

          {rightIcon ? (
            <TouchableOpacity style={styles.rightButton} onPress={onRightPress}>
              <Icon name={rightIcon} size={24} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.rightButton} />
          )}
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingTop: 40,
    paddingBottom: 15,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginHorizontal: 10,
  },
  rightButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SimpleHeader;
