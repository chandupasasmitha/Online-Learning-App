import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../context/AuthContext";

const CustomHeader = ({
  title,
  subtitle,
  showSearch,
  onSearchPress,
  showNotification,
  navigation,
}) => {
  const { user } = useContext(AuthContext);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#EBF5FB" />
      <View style={styles.header}>
        <View style={styles.container}>
          {/* Top Row */}
          <View style={styles.topRow}>
            <View style={styles.userInfo}>
              <TouchableOpacity
                style={styles.avatar}
                onPress={() => navigation?.navigate("Profile")}
              >
                <Text style={styles.avatarText}>
                  {getInitials(user?.fullName || user?.username)}
                </Text>
              </TouchableOpacity>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>{getGreeting()} 👋</Text>
                <Text style={styles.userName}>
                  {user?.fullName || user?.username || "User"}
                </Text>
              </View>
            </View>

            <View style={styles.rightIcons}>
              {showNotification && (
                <TouchableOpacity style={styles.iconButton}>
                  <Icon name="bell-outline" size={24} color="#21618C" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Title Row */}
          {title && (
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              </View>
              {showSearch && (
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={onSearchPress}
                >
                  <Icon name="magnify" size={22} color="#21618C" />
                </TouchableOpacity>
              )}
            </View>
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
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#AED6F1",
  },
  container: {
    // Container styles
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D6EAF8", // Light blue for avatar
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#5DADE2", // Medium blue border
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#21618C", // Dark blue text
  },
  greetingContainer: {
    justifyContent: "center",
  },
  greeting: {
    fontSize: 14,
    color: "#5499C7", // Medium blue
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#154360", // Navy blue
  },
  rightIcons: {
    flexDirection: "row",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D6EAF8", // Light blue
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EBF5FB",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#154360", // Navy blue
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 14,
    color: "#5499C7", // Medium blue
  },
  searchButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#D6EAF8", // Light blue
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#AED6F1",
  },
});

export default CustomHeader;
