// Enrolled courses screen
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { courseAPI, enrollmentAPI } from "../../api";
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CourseDetailsScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollmentStatus();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      const response = await courseAPI.getCourseById(courseId);
      setCourse(response.data.data.course);
    } catch (error) {
      console.error("Error fetching course:", error);
      Alert.alert("Error", "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const response = await enrollmentAPI.checkEnrollment(courseId);
      setIsEnrolled(response.data.data.isEnrolled);
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollmentAPI.enrollInCourse(courseId);
      Alert.alert(
        "Success!",
        "You have successfully enrolled in this course.",
        [{ text: "OK", onPress: () => setIsEnrolled(true) }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Enrollment failed"
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Text>Course not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{course.title}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{course.level}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Icon name="account" size={20} color="#666" />
          <Text style={styles.infoText}>
            {course.instructor?.fullName || course.instructor?.username}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="book-open-variant" size={20} color="#666" />
          <Text style={styles.infoText}>{course.category}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{course.duration}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="account-group" size={20} color="#666" />
          <Text style={styles.infoText}>
            {course.enrollmentCount} students enrolled
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{course.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Course Content</Text>
        <Text style={styles.content}>{course.content}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {isEnrolled ? (
          <View style={styles.enrolledBadge}>
            <Icon name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.enrolledText}>Already Enrolled</Text>
          </View>
        ) : (
          <Button
            title="Enroll Now"
            onPress={handleEnroll}
            loading={enrolling}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    backgroundColor: "#007AFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  levelBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  levelText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    padding: 20,
    backgroundColor: "#F9F9F9",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#666",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  content: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  buttonContainer: {
    padding: 20,
  },
  enrolledBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
  },
  enrolledText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
});

export default CourseDetailsScreen;
