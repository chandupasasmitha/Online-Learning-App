// Add course screen
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { courseAPI } from "../../api";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

const AddCourseScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    level: "Beginner",
    duration: "",
    price: "0",
  });
  const [loading, setLoading] = useState(false);

  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { title, description, content } = formData;

    if (!title || !description || !content) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await courseAPI.createCourse(formData);
      Alert.alert("Success", "Course created successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <InputField
          label="Course Title *"
          placeholder="Enter course title"
          value={formData.title}
          onChangeText={(value) => handleChange("title", value)}
        />

        <InputField
          label="Description *"
          placeholder="Enter course description"
          value={formData.description}
          onChangeText={(value) => handleChange("description", value)}
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <InputField
          label="Course Content *"
          placeholder="Enter course content/curriculum"
          value={formData.content}
          onChangeText={(value) => handleChange("content", value)}
          multiline
          numberOfLines={6}
          style={styles.textArea}
        />

        <InputField
          label="Category"
          placeholder="e.g., Programming, Design, Business"
          value={formData.category}
          onChangeText={(value) => handleChange("category", value)}
        />

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Level *</Text>
          <View style={styles.levelContainer}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  formData.level === level && styles.levelButtonActive,
                ]}
                onPress={() => handleChange("level", level)}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    formData.level === level && styles.levelButtonTextActive,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <InputField
          label="Duration"
          placeholder="e.g., 4 weeks, Self-paced"
          value={formData.duration}
          onChangeText={(value) => handleChange("duration", value)}
        />

        <InputField
          label="Price"
          placeholder="Enter price (0 for free)"
          value={formData.price}
          onChangeText={(value) => handleChange("price", value)}
          keyboardType="numeric"
        />

        <Button
          title="Create Course"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
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
    padding: 20,
  },
  textArea: {
    height: "auto",
    minHeight: 100,
    textAlignVertical: "top",
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  levelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#F5F5F5",
  },
  levelButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  levelButtonTextActive: {
    color: "#FFF",
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default AddCourseScreen;
