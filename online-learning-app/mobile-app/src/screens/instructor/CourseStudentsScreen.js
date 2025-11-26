import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { courseAPI } from "../../api";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

const CourseStudentsScreen = ({ route }) => {
  const { courseId } = route.params;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await courseAPI.getCourseStudents(courseId);
      setStudents(response.data.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  const renderStudentCard = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.avatarContainer}>
        <Icon name="account-circle" size={50} color="#007AFF" />
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.fullName || item.username}</Text>
        <Text style={styles.studentEmail}>{item.email}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            Enrolled: {new Date(item.enrolledAt).toLocaleDateString()}
          </Text>
          <View style={[styles.statusBadge, getStatusColor(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        {item.progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${item.progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        )}
      </View>
    </View>
  );

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

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Total Students: {students.length}</Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderStudentCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-off-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No students enrolled yet</Text>
          </View>
        }
      />
    </View>
  );
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
  },
  header: {
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
  studentCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 15,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#999",
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
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
    width: 40,
    textAlign: "right",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
  },
});

export default CourseStudentsScreen;
