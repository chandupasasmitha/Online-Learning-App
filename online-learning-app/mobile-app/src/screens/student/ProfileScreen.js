import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const MenuItem = ({ icon, title, onPress, color = "#333" }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={24} color={color} />
      <Text style={[styles.menuText, { color }]}>{title}</Text>
      <Icon name="chevron-right" size={24} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="account-circle" size={100} color="#FFF" />
        </View>
        <Text style={styles.name}>{user?.fullName || user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user?.role === "student" ? "Student" : "Instructor"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <MenuItem
          icon="account-edit"
          title="Edit Profile"
          onPress={() =>
            Alert.alert("Coming Soon", "This feature is under development")
          }
        />
        <MenuItem
          icon="lock"
          title="Change Password"
          onPress={() =>
            Alert.alert("Coming Soon", "This feature is under development")
          }
        />
        <MenuItem
          icon="bell"
          title="Notifications"
          onPress={() =>
            Alert.alert("Coming Soon", "This feature is under development")
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <MenuItem
          icon="theme-light-dark"
          title="Dark Mode"
          onPress={() =>
            Alert.alert("Coming Soon", "This feature is under development")
          }
        />
        <MenuItem
          icon="translate"
          title="Language"
          onPress={() =>
            Alert.alert("Coming Soon", "This feature is under development")
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <MenuItem
          icon="help-circle"
          title="Help & Support"
          onPress={() =>
            Alert.alert("Coming Soon", "This feature is under development")
          }
        />
        <MenuItem
          icon="information"
          title="About"
          onPress={() => Alert.alert("About", "Online Learning App v1.0.0")}
        />
      </View>

      <View style={styles.section}>
        <MenuItem
          icon="logout"
          title="Logout"
          onPress={handleLogout}
          color="#FF3B30"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 30,
    paddingTop: 60,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#FFF",
    opacity: 0.9,
    marginBottom: 10,
  },
  roleBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  roleText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#FFF",
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    paddingHorizontal: 20,
    paddingVertical: 10,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  footer: {
    alignItems: "center",
    padding: 30,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});

export default ProfileScreen;
