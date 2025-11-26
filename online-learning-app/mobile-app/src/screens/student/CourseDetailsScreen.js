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
import SimpleHeader from "../../components/SimpleHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CourseDetailsScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);

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
      setEnrollmentData(response.data.data.enrollment);
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollmentAPI.enrollInCourse(courseId);
      Alert.alert(
        "Success! 🎉",
        "You have successfully enrolled in this course.",
        [
          {
            text: "Go to My Courses",
            onPress: () => navigation.navigate("My Courses"),
          },
          {
            text: "OK",
            onPress: () => {
              setIsEnrolled(true);
              checkEnrollmentStatus();
            },
          },
        ]
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
        <ActivityIndicator size="large" color="#5DADE2" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={64} color="#FF6B6B" />
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SimpleHeader
        title="Course Details"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        {/* Course Header */}
        <View style={styles.header}>
          <View style={styles.courseThumbnail}>
            <Icon name="book-open-variant" size={50} color="#5DADE2" />
          </View>

          <Text style={styles.title}>{course.title}</Text>

          <View style={styles.badges}>
            <View style={[styles.levelBadge, getLevelColor(course.level)]}>
              <Text style={styles.levelText}>{course.level}</Text>
            </View>
            {isEnrolled && (
              <View style={styles.enrolledStatusBadge}>
                <Icon name="check-circle" size={16} color="#FFF" />
                <Text style={styles.enrolledStatusText}>Already Enrolled</Text>
              </View>
            )}
          </View>
        </View>

        {/* Course Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Icon name="account" size={20} color="#5499C7" />
            <Text style={styles.infoText}>
              {course.instructor?.fullName || course.instructor?.username}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="book-open-variant" size={20} color="#5499C7" />
            <Text style={styles.infoText}>{course.category}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="clock-outline" size={20} color="#5499C7" />
            <Text style={styles.infoText}>{course.duration}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="account-group" size={20} color="#5499C7" />
            <Text style={styles.infoText}>
              {course.enrollmentCount} students enrolled
            </Text>
          </View>
        </View>

        {/* Enrollment Status Card */}
        {isEnrolled && enrollmentData && (
          <View style={styles.enrollmentStatusCard}>
            <View style={styles.enrollmentHeader}>
              <Icon name="bookmark-check" size={24} color="#52C787" />
              <Text style={styles.enrollmentStatusTitle}>Your Enrollment</Text>
            </View>
            <View style={styles.enrollmentDetails}>
              <View style={styles.enrollmentDetail}>
                <Text style={styles.enrollmentLabel}>Status</Text>
                <View
                  style={[
                    styles.statusPill,
                    getStatusColor(enrollmentData.status),
                  ]}
                >
                  <Text style={styles.statusPillText}>
                    {enrollmentData.status.charAt(0).toUpperCase() +
                      enrollmentData.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.enrollmentDetail}>
                <Text style={styles.enrollmentLabel}>Progress</Text>
                <Text style={styles.progressValue}>
                  {enrollmentData.progress}%
                </Text>
              </View>
              <View style={styles.enrollmentDetail}>
                <Text style={styles.enrollmentLabel}>Enrolled</Text>
                <Text style={styles.dateValue}>
                  {new Date(enrollmentData.enrolledAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{course.description}</Text>
        </View>

        {/* Content Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          <Text style={styles.content}>{course.content}</Text>
        </View>

        {/* Enroll Button */}
        <View style={styles.buttonContainer}>
          {isEnrolled ? (
            <View style={styles.alreadyEnrolledContainer}>
              <Icon name="check-circle-outline" size={60} color="#52C787" />
              <Text style={styles.alreadyEnrolledText}>
                You're enrolled in this course!
              </Text>
              <Button
                title="Go to My Courses"
                onPress={() => navigation.navigate("My Courses")}
                style={styles.goToCoursesButton}
              />
            </View>
          ) : (
            <Button
              title="Enroll Now"
              onPress={handleEnroll}
              loading={enrolling}
            />
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const getLevelColor = (level) => {
  switch (level) {
    case "Beginner":
      return { backgroundColor: "#52C787" };
    case "Intermediate":
      return { backgroundColor: "#FFB84D" };
    case "Advanced":
      return { backgroundColor: "#FF6B6B" };
    default:
      return { backgroundColor: "#AED6F1" };
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return { backgroundColor: "#52C787" };
    case "completed":
      return { backgroundColor: "#5DADE2" };
    case "dropped":
      return { backgroundColor: "#FF6B6B" };
    default:
      return { backgroundColor: "#AED6F1" };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  errorText: {
    fontSize: 18,
    color: "#666666",
    marginTop: 15,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  courseThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
    textAlign: "center",
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  levelText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  enrolledStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#52C787",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  enrolledStatusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333333",
  },
  enrollmentStatusCard: {
    backgroundColor: "#E8F8F0",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#52C787",
  },
  enrollmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  enrollmentStatusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginLeft: 10,
  },
  enrollmentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  enrollmentDetail: {
    alignItems: "center",
  },
  enrollmentLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 5,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  progressValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  dateValue: {
    fontSize: 12,
    color: "#333333",
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 22,
  },
  content: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 22,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
  },
  alreadyEnrolledContainer: {
    alignItems: "center",
    padding: 20,
  },
  alreadyEnrolledText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#52C787",
    marginTop: 15,
    marginBottom: 20,
  },
  goToCoursesButton: {
    backgroundColor: "#7B68EE",
  },
});

export default CourseDetailsScreen;
