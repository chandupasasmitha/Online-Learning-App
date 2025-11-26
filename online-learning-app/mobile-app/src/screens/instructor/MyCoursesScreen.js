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
import CustomHeader from "../../components/CustomHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
      "Are you sure you want to delete this course? This action cannot be undone.",
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
        <Icon name="pencil" size={18} color="#5DADE2" />
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() =>
          navigation.navigate("CourseStudents", { courseId: course._id })
        }
      >
        <Icon name="account-group" size={18} color="#52C787" />
        <Text style={[styles.actionText, { color: "#52C787" }]}>
          Students ({course.enrollmentCount || 0})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleDeleteCourse(course._id)}
      >
        <Icon name="delete" size={18} color="#FF6B6B" />
        <Text style={[styles.actionText, { color: "#FF6B6B" }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5DADE2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title="My Courses"
        subtitle={`${courses.length} ${
          courses.length === 1 ? "course" : "courses"
        } created`}
        showNotification
        navigation={navigation}
      />

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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#5DADE2"
            colors={["#5DADE2"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="book-plus-outline" size={80} color="#D6EAF8" />
            <Text style={styles.emptyText}>No courses yet</Text>
            <Text style={styles.emptySubtext}>Create your first course!</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("AddCourse")}
            >
              <Icon name="plus" size={20} color="#FFF" />
              <Text style={styles.createButtonText}>Create Course</Text>
            </TouchableOpacity>
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
    backgroundColor: "#F5F5F5",
  },
  listContent: {
    padding: 15,
    paddingBottom: 80,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginHorizontal: 15,
    marginBottom: 15,
    marginTop: -10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderTopWidth: 0,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: "600",
    color: "#7B68EE",
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7B68EE",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#7B68EE",
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
