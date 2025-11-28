import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SimpleHeader = ({ title, onBackPress, rightIcon, onRightPress }) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#EBF5FB" />
      <View style={styles.header}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Icon name="arrow-left" size={24} color="#21618C" />
          </TouchableOpacity>

          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          {rightIcon ? (
            <TouchableOpacity style={styles.rightButton} onPress={onRightPress}>
              <Icon name={rightIcon} size={24} color="#21618C" />
            </TouchableOpacity>
          ) : (
            <View style={styles.rightButton} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#EBF5FB", // Calm light blue
    paddingTop: 35,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#AED6F1",
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
    backgroundColor: "#D6EAF8", // Light blue
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#154360", // Navy blue
    textAlign: "center",
    marginHorizontal: 10,
  },
  rightButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D6EAF8", // Light blue
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SimpleHeader;
