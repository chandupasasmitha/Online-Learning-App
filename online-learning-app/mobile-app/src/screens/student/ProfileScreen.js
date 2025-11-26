import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Switch,
  Linking,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import CustomHeader from "../../components/CustomHeader";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { authAPI } from "../../api";

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [loggingOut, setLoggingOut] = useState(false);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Edit profile form
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
  });

  // Change password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editLoading, setEditLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          await logout();
          setLoggingOut(false);
        },
      },
    ]);
  };

  const handleEditProfile = async () => {
    if (!editForm.fullName.trim() || !editForm.username.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setEditLoading(true);

    // Simulate API call (replace with actual API when available)
    setTimeout(() => {
      setEditLoading(false);
      setShowEditModal(false);
      Alert.alert("Success", "Profile updated successfully!");
      // In real implementation, update the user context here
    }, 1500);
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    setPasswordLoading(true);

    // Simulate API call (replace with actual API when available)
    setTimeout(() => {
      setPasswordLoading(false);
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      Alert.alert("Success", "Password changed successfully!");
    }, 1500);
  };

  const handleNotificationToggle = (value) => {
    setNotificationsEnabled(value);
    if (value) {
      Alert.alert(
        "Notifications Enabled",
        "You will receive course updates and announcements."
      );
    } else {
      Alert.alert(
        "Notifications Disabled",
        "You will not receive notifications."
      );
    }
  };

  const handleDarkModeToggle = (value) => {
    setDarkModeEnabled(value);
    Alert.alert(
      "Dark Mode",
      value
        ? "Dark mode will be available in the next update!"
        : "Dark mode disabled"
    );
  };

  const handleHelpSupport = () => {
    Alert.alert("Help & Support", "How can we help you?", [
      {
        text: "Email Support",
        onPress: () => Linking.openURL("mailto:support@onlinelearning.com"),
      },
      {
        text: "FAQ",
        onPress: () => Alert.alert("FAQ", "FAQ section coming soon!"),
      },
      {
        text: "Live Chat",
        onPress: () =>
          Alert.alert("Live Chat", "Live chat support coming soon!"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleAbout = () => {
    setShowAboutModal(true);
  };

  const MenuItem = ({
    icon,
    title,
    onPress,
    color = "#154360",
    showChevron = true,
    rightComponent,
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={24} color={color} />
      <Text style={[styles.menuText, { color }]}>{title}</Text>
      {rightComponent ||
        (showChevron && (
          <Icon name="chevron-right" size={24} color="#AED6F1" />
        ))}
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Profile"
        subtitle="Manage your account settings"
        navigation={navigation}
      />

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Icon name="account-circle" size={100} color="#5DADE2" />
          </View>
          <Text style={styles.name}>{user.fullName || user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Icon
              name={user.role === "student" ? "school" : "teach"}
              size={16}
              color="#FFF"
              style={styles.roleIcon}
            />
            <Text style={styles.roleText}>
              {user.role === "student" ? "Student" : "Instructor"}
            </Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuItem
            icon="account-edit"
            title="Edit Profile"
            onPress={() => setShowEditModal(true)}
          />
          <MenuItem
            icon="lock"
            title="Change Password"
            onPress={() => setShowPasswordModal(true)}
          />
          <View style={styles.menuItem}>
            <Icon name="bell" size={24} color="#154360" />
            <Text style={styles.menuText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: "#D6EAF8", true: "#5DADE2" }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuItem}>
            <Icon name="theme-light-dark" size={24} color="#154360" />
            <Text style={styles.menuText}>Dark Mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: "#D6EAF8", true: "#5DADE2" }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <MenuItem
            icon="help-circle"
            title="Help & Support"
            onPress={handleHelpSupport}
          />
          <MenuItem icon="information" title="About" onPress={handleAbout} />
          <MenuItem
            icon="shield-check"
            title="Privacy Policy"
            onPress={() =>
              Alert.alert(
                "Privacy Policy",
                "Your privacy is important to us. We protect your data with industry-standard security measures."
              )
            }
          />
          <MenuItem
            icon="file-document"
            title="Terms of Service"
            onPress={() =>
              Alert.alert(
                "Terms of Service",
                "By using this app, you agree to our terms and conditions."
              )
            }
          />
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#FF6B6B"
                  style={styles.logoutIcon}
                />
                <Text style={styles.logoutText}>Logging out...</Text>
              </>
            ) : (
              <>
                <Icon
                  name="logout"
                  size={24}
                  color="#FF6B6B"
                  style={styles.logoutIcon}
                />
                <Text style={styles.logoutText}>Logout</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Online Learning Platform</Text>
          <Text style={styles.footerTextSmall}>© 2025 All rights reserved</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Icon name="close" size={24} color="#154360" />
              </TouchableOpacity>
            </View>

            <InputField
              label="Full Name"
              placeholder="Enter your full name"
              value={editForm.fullName}
              onChangeText={(value) =>
                setEditForm({ ...editForm, fullName: value })
              }
            />

            <InputField
              label="Username"
              placeholder="Enter your username"
              value={editForm.username}
              onChangeText={(value) =>
                setEditForm({ ...editForm, username: value })
              }
              autoCapitalize="none"
            />

            <InputField
              label="Email"
              value={user.email}
              editable={false}
              style={styles.disabledInput}
            />
            <Text style={styles.helperText}>Email cannot be changed</Text>

            <Button
              title="Save Changes"
              onPress={handleEditProfile}
              loading={editLoading}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Icon name="close" size={24} color="#154360" />
              </TouchableOpacity>
            </View>

            <InputField
              label="Current Password"
              placeholder="Enter current password"
              value={passwordForm.currentPassword}
              onChangeText={(value) =>
                setPasswordForm({ ...passwordForm, currentPassword: value })
              }
              secureTextEntry
            />

            <InputField
              label="New Password"
              placeholder="Enter new password"
              value={passwordForm.newPassword}
              onChangeText={(value) =>
                setPasswordForm({ ...passwordForm, newPassword: value })
              }
              secureTextEntry
            />

            <InputField
              label="Confirm New Password"
              placeholder="Re-enter new password"
              value={passwordForm.confirmPassword}
              onChangeText={(value) =>
                setPasswordForm({ ...passwordForm, confirmPassword: value })
              }
              secureTextEntry
            />

            <Button
              title="Change Password"
              onPress={handleChangePassword}
              loading={passwordLoading}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={showAboutModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.aboutModalContent}>
            <Icon name="school" size={60} color="#5DADE2" />
            <Text style={styles.aboutTitle}>Online Learning Platform</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutText}>
                Your gateway to knowledge and skills development. Learn from
                expert instructors and advance your career.
              </Text>
            </View>

            <View style={styles.aboutFeatures}>
              <View style={styles.featureItem}>
                <Icon name="check-circle" size={20} color="#52C787" />
                <Text style={styles.featureText}>
                  AI-Powered Recommendations
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="check-circle" size={20} color="#52C787" />
                <Text style={styles.featureText}>Expert Instructors</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="check-circle" size={20} color="#52C787" />
                <Text style={styles.featureText}>Interactive Learning</Text>
              </View>
            </View>

            <View style={styles.aboutContact}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() =>
                  Linking.openURL("mailto:support@onlinelearning.com")
                }
              >
                <Icon name="email" size={18} color="#5DADE2" />
                <Text style={styles.contactText}>Contact Support</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Close"
              onPress={() => setShowAboutModal(false)}
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F8FB",
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D6EAF8",
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#154360",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#5499C7",
    marginBottom: 10,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5DADE2",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  roleIcon: {
    marginRight: 5,
  },
  roleText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginTop: 15,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5499C7",
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
    borderBottomColor: "#EBF5FB",
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#154360",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  logoutIcon: {
    marginRight: 15,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    padding: 30,
    paddingBottom: 50,
  },
  footerText: {
    fontSize: 12,
    color: "#5499C7",
    marginBottom: 5,
  },
  footerTextSmall: {
    fontSize: 10,
    color: "#85C1E9",
    marginTop: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#154360",
  },
  modalButton: {
    marginTop: 10,
  },
  disabledInput: {
    backgroundColor: "#EBF5FB",
    color: "#85C1E9",
  },
  helperText: {
    fontSize: 12,
    color: "#5499C7",
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  // About Modal
  aboutModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    width: "90%",
    alignItems: "center",
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#154360",
    marginTop: 15,
    marginBottom: 5,
  },
  aboutVersion: {
    fontSize: 14,
    color: "#5499C7",
    marginBottom: 20,
  },
  aboutSection: {
    width: "100%",
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 14,
    color: "#5499C7",
    textAlign: "center",
    lineHeight: 22,
  },
  aboutFeatures: {
    width: "100%",
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: "#154360",
    marginLeft: 10,
  },
  aboutContact: {
    width: "100%",
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EBF5FB",
    padding: 12,
    borderRadius: 10,
  },
  contactText: {
    color: "#5DADE2",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  closeButton: {
    width: "100%",
  },
});

export default ProfileScreen;
