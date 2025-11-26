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
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

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

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerInfo}>
        <Text style={styles.headerText}>
          {enrollments.length} {enrollments.length === 1 ? "Course" : "Courses"}
        </Text>
      </View>

      <FlatList
        data={enrollments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <CourseCard
              course={item.course}
              onPress={() => {
                // Navigate to course details if needed
              }}
            />
            <View style={styles.enrollmentInfo}>
              <Text style={styles.enrollmentDate}>
                Enrolled: {new Date(item.enrolledAt).toLocaleDateString()}
              </Text>
              <View style={[styles.statusBadge, getStatusColor(item.status)]}>
                <Text style={styles.statusText}>{item.status}</Text>
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
            <Icon name="book-remove-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No enrolled courses yet</Text>
            <Text style={styles.emptySubtext}>
              Explore courses and start learning!
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
      return { backgroundColor: "#4CAF50" };
    case "completed":
      return { backgroundColor: "#2196F3" };
    case "dropped":
      return { backgroundColor: "#F44336" };
    default:
      return { backgroundColor: "#9E9E9E" };
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
  headerInfo: {
    backgroundColor: "#FFF",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
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
  enrollmentDate: {
    fontSize: 12,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#BBB",
    marginTop: 8,
    textAlign: "center",
  },
});

export default EnrolledCoursesScreen;
