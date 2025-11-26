// My courses screen
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { courseAPI } from "../../api";
import CourseCard from "../../components/CourseCard";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

const MyCoursesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [])
  );

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getInstructorCourses();
      setCourses(response.data.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      Alert.alert("Error", "Failed to fetch courses");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const handleDeleteCourse = (courseId) => {
    Alert.alert(
      "Delete Course",
      "Are you sure you want to delete this course?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await courseAPI.deleteCourse(courseId);
              Alert.alert("Success", "Course deleted successfully");
              fetchCourses();
            } catch (error) {
              Alert.alert("Error", "Failed to delete course");
            }
          },
        },
      ]
    );
  };

  const renderCourseActions = (course) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate("EditCourse", { course })}
      >
        <Icon name="pencil" size={20} color="#007AFF" />
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() =>
          navigation.navigate("CourseStudents", { courseId: course._id })
        }
      >
        <Icon name="account-group" size={20} color="#4CAF50" />
        <Text style={styles.actionText}>Students</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleDeleteCourse(course._id)}
      >
        <Icon name="delete" size={20} color="#FF3B30" />
        <Text style={[styles.actionText, { color: "#FF3B30" }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <CourseCard course={item} onPress={() => {}} />
            {renderCourseActions(item)}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="book-plus-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No courses yet</Text>
            <Text style={styles.emptySubtext}>Create your first course!</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddCourse")}
      >
        <Icon name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
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
  listContent: {
    padding: 15,
    paddingBottom: 80,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    padding: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    marginTop: -10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
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
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default MyCoursesScreen;
