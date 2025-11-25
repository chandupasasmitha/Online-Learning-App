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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our learning community</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Full Name *"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(value) => handleChange("fullName", value)}
          />

          <InputField
            label="Username *"
            placeholder="Choose a username"
            value={formData.username}
            onChangeText={(value) => handleChange("username", value)}
            autoCapitalize="none"
          />

          <InputField
            label="Email *"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Password *"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
          />

          <InputField
            label="Confirm Password *"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange("confirmPassword", value)}
            secureTextEntry
          />

          <Text style={styles.roleLabel}>I am a:</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                formData.role === "student" && styles.roleButtonActive,
              ]}
              onPress={() => handleChange("role", "student")}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  formData.role === "student" && styles.roleButtonTextActive,
                ]}
              >
                Student
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                formData.role === "instructor" && styles.roleButtonActive,
              ]}
              onPress={() => handleChange("role", "instructor")}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  formData.role === "instructor" && styles.roleButtonTextActive,
                ]}
              >
                Instructor
              </Text>
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
    backgroundColor: "#FFF",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    width: "100%",
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#F5F5F5",
  },
  roleButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  roleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  roleButtonTextActive: {
    color: "#FFF",
  },
  registerButton: {
    marginTop: 10,
  },
  loginLink: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginTextBold: {
    color: "#007AFF",
    fontWeight: "600",
  },
});

export default RegisterScreen;
