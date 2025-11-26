import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { courseAPI, enrollmentAPI } from "../../api";
import CourseCard from "../../components/CourseCard";
import CustomHeader from "../../components/CustomHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CoursesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, courses]);

  const fetchData = async () => {
    try {
      // Fetch all courses
      const coursesResponse = await courseAPI.getAllCourses();
      setCourses(coursesResponse.data.data.courses);
      setFilteredCourses(coursesResponse.data.data.courses);

      // Fetch user's enrollments to check which courses they're enrolled in
      try {
        const enrollmentsResponse = await enrollmentAPI.getMyEnrollments();
        const enrolledIds = enrollmentsResponse.data.data.enrollments.map(
          (enrollment) => enrollment.course._id
        );
        setEnrolledCourseIds(enrolledIds);
      } catch (enrollError) {
        console.log("Error fetching enrollments:", enrollError);
        // Continue even if enrollment fetch fails
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterCourses = () => {
    if (!searchQuery.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const isEnrolled = (courseId) => {
    return enrolledCourseIds.includes(courseId);
  };

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
        title="Explore Courses"
        subtitle={`${courses.length} courses available`}
        showSearch
        onSearchPress={() => setShowSearchModal(true)}
        showNotification
        navigation={navigation}
      />

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="book-open-variant" size={24} color="#5DADE2" />
          <Text style={styles.statNumber}>{courses.length}</Text>
          <Text style={styles.statLabel}>Total Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="bookmark-check" size={24} color="#52C787" />
          <Text style={styles.statNumber}>{enrolledCourseIds.length}</Text>
          <Text style={styles.statLabel}>Your Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="star" size={24} color="#FFD93D" />
          <Text style={styles.statNumber}>
            {courses.length - enrolledCourseIds.length}
          </Text>
          <Text style={styles.statLabel}>Explore</Text>
        </View>
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            isEnrolled={isEnrolled(item._id)}
            onPress={() =>
              navigation.navigate("CourseDetails", { courseId: item._id })
            }
          />
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
            <Icon name="book-open-outline" size={64} color="#D6EAF8" />
            <Text style={styles.emptyText}>No courses available</Text>
          </View>
        }
      />

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.searchHeader}>
              <Text style={styles.searchTitle}>Search Courses</Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <Icon name="close" size={24} color="#154360" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchInputContainer}>
              <Icon
                name="magnify"
                size={20}
                color="#5499C7"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by title, description, or category..."
                placeholderTextColor="#85C1E9"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Icon name="close-circle" size={20} color="#AED6F1" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.resultText}>
              {filteredCourses.length}{" "}
              {filteredCourses.length === 1 ? "course" : "courses"} found
            </Text>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowSearchModal(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F8FB",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#D6EAF8",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    marginHorizontal: 5,
    backgroundColor: "#EBF5FB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D6EAF8",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#154360",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#5499C7",
    marginTop: 4,
  },
  listContent: {
    padding: 15,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#5499C7",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    minHeight: 250,
  },
  searchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#154360",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF5FB",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D6EAF8",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#154360",
  },
  resultText: {
    fontSize: 14,
    color: "#5499C7",
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: "#5DADE2",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CoursesScreen;
