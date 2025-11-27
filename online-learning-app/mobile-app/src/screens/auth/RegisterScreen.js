// Register screen
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    const { username, email, password, confirmPassword, fullName } = formData;

    if (!username || !email || !password || !fullName) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (!result.success) {
      Alert.alert("Registration Failed", result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Icon name="school" size={60} color="#FFF" />
          </View>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.tagline}>Start your learning journey today</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formCard}>
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(value) => handleChange("fullName", value)}
            icon="account"
          />

          <InputField
            label="Username"
            placeholder="Choose a username"
            value={formData.username}
            onChangeText={(value) => handleChange("username", value)}
            autoCapitalize="none"
            icon="at"
          />

          <InputField
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="email"
          />

          <InputField
            label="Password"
            placeholder="Create a password (min 6 characters)"
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
            icon="lock"
          />

          <InputField
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange("confirmPassword", value)}
            secureTextEntry
            icon="lock-check"
          />

          <Text style={styles.roleLabel}>Select Your Role</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleCard,
                formData.role === "student" && styles.roleCardActive,
              ]}
              onPress={() => handleChange("role", "student")}
            >
              <Icon
                name="account"
                size={32}
                color={formData.role === "student" ? "#5DADE2" : "#999"}
              />
              <Text
                style={[
                  styles.roleCardTitle,
                  formData.role === "student" && styles.roleCardTitleActive,
                ]}
              >
                Student
              </Text>
              <Text style={styles.roleCardSubtitle}>Learn & Grow</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleCard,
                formData.role === "instructor" && styles.roleCardActive,
              ]}
              onPress={() => handleChange("role", "instructor")}
            >
              <Icon
                name="teach"
                size={32}
                color={formData.role === "instructor" ? "#9D7CD8" : "#999"}
              />
              <Text
                style={[
                  styles.roleCardTitle,
                  formData.role === "instructor" && styles.roleCardTitleActive,
                ]}
              >
                Instructor
              </Text>
              <Text style={styles.roleCardSubtitle}>Teach & Share</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    backgroundColor: "#5DADE2",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#FFF",
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginTop: 5,
  },
  roleContainer: {
    flexDirection: "row",
    marginBottom: 25,
    gap: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  roleCardActive: {
    backgroundColor: "#F0F8FF",
    borderColor: "#5DADE2",
    borderWidth: 2,
  },
  roleCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666",
    marginTop: 10,
    marginBottom: 4,
  },
  roleCardTitleActive: {
    color: "#333",
  },
  roleCardSubtitle: {
    fontSize: 12,
    color: "#999",
  },
  registerButton: {
    marginTop: 10,
    backgroundColor: "#5DADE2",
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: "#5DADE2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginLink: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  loginText: {
    fontSize: 15,
    color: "#666",
  },
  loginTextBold: {
    color: "#5DADE2",
    fontWeight: "700",
  },
});

export default RegisterScreen;
