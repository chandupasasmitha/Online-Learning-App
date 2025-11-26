import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { enrollmentAPI } from "../../api";
import CourseCard from "../../components/CourseCard";
import CustomHeader from "../../components/CustomHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const EnrolledCoursesScreen = ({ navigation }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchEnrollments();
    }, [])
  );

  const fetchEnrollments = async () => {
    try {
      const response = await enrollmentAPI.getMyEnrollments();
      setEnrollments(response.data.data.enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEnrollments();
  };

  const calculateTotalProgress = () => {
    if (enrollments.length === 0) return 0;
    const total = enrollments.reduce((sum, e) => sum + (e.progress || 0), 0);
    return Math.round(total / enrollments.length);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title="My Learning"
        subtitle={`${enrollments.length} ${
          enrollments.length === 1 ? "course" : "courses"
        } enrolled`}
        showNotification
        navigation={navigation}
      />

      {/* Progress Stats */}
      {enrollments.length > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <Text style={styles.progressPercentage}>
                {calculateTotalProgress()}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${calculateTotalProgress()}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Keep learning! You're doing great 🎉
            </Text>
          </View>
        </View>
      )}

      <FlatList
        data={enrollments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <CourseCard course={item.course} onPress={() => {}} />
            <View style={styles.enrollmentInfo}>
              <View style={styles.enrollmentDetails}>
                <Icon name="calendar" size={14} color="#666" />
                <Text style={styles.enrollmentDate}>
                  {" "}
                  Enrolled: {new Date(item.enrolledAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <View style={[styles.statusBadge, getStatusColor(item.status)]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
                {item.progress !== undefined && (
                  <Text style={styles.progressBadge}>
                    {item.progress}% complete
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="book-remove-outline" size={80} color="#DDD" />
            <Text style={styles.emptyText}>No enrolled courses yet</Text>
            <Text style={styles.emptySubtext}>
              Start exploring and enroll in courses to begin your learning
              journey!
            </Text>
          </View>
        }
      />
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return { backgroundColor: "#34C759" };
    case "completed":
      return { backgroundColor: "#007AFF" };
    case "dropped":
      return { backgroundColor: "#FF3B30" };
    default:
      return { backgroundColor: "#8E8E93" };
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
  progressContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    marginBottom: 5,
  },
  progressCard: {
    backgroundColor: "#F8F9FA",
    padding: 20,
    borderRadius: 15,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  listContent: {
    padding: 15,
  },
  enrollmentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  enrollmentDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  enrollmentDate: {
    fontSize: 12,
    color: "#666",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  progressBadge: {
    fontSize: 11,
    color: "#007AFF",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#999",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#BBB",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default EnrolledCoursesScreen;
