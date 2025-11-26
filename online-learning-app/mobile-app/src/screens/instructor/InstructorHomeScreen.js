import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { courseAPI } from "../../api";
import CustomHeader from "../../components/CustomHeader";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const InstructorHomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [courses, setCourses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const coursesRes = await courseAPI.getInstructorCourses();
      setCourses(coursesRes.data.data.courses);

      // Calculate total students across all courses
      const total = coursesRes.data.data.courses.reduce(
        (sum, course) => sum + (course.enrollmentCount || 0),
        0
      );
      setTotalStudents(total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const quickActions = [
    {
      id: 1,
      icon: "book-plus",
      label: "Create Course",
      color: "#7B68EE",
      screen: "AddCourse",
    },
    {
      id: 2,
      icon: "bookshelf",
      label: "My Courses",
      color: "#52C787",
      screen: "MyCoursesList",
    },
    {
      id: 3,
      icon: "account-group",
      label: "All Students",
      color: "#FFB84D",
      screen: null,
      action: "students",
    },
    {
      id: 4,
      icon: "chart-line",
      label: "Analytics",
      color: "#9D7CD8",
      screen: null,
      action: "analytics",
    },
  ];

  const handleQuickAction = (action) => {
    if (action.screen) {
      navigation.navigate(action.screen);
    } else if (action.action === "students") {
      // Show total students info
      alert(
        `Total Students: ${totalStudents}\nAcross ${courses.length} courses`
      );
    } else if (action.action === "analytics") {
      alert("Analytics Dashboard - Coming Soon!");
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B68EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title={`Welcome, ${user?.fullName?.split(" ")[0] || user?.username}!`}
        subtitle="Manage your courses and students"
        showNotification
        navigation={navigation}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Icon name="book-multiple" size={32} color="#5DADE2" />
            <Text style={styles.statNumber}>{courses.length}</Text>
            <Text style={styles.statLabel}>Total Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="account-group" size={32} color="#FFB84D" />
            <Text style={styles.statNumber}>{totalStudents}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="fire" size={32} color="#FF6B6B" />
            <Text style={styles.statNumber}>
              {courses.filter((c) => c.isPublished).length}
            </Text>
            <Text style={styles.statLabel}>Active Courses</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => handleQuickAction(action)}
              >
                <View
                  style={[styles.actionIcon, { backgroundColor: action.color }]}
                >
                  <Icon name={action.icon} size={28} color="#FFF" />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Course Performance Overview */}
        {courses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <View style={styles.performanceCard}>
              <View style={styles.performanceRow}>
                <View style={styles.performanceItem}>
                  <Icon name="chart-arc" size={24} color="#5DADE2" />
                  <View style={styles.performanceContent}>
                    <Text style={styles.performanceValue}>
                      {Math.round(totalStudents / courses.length)}
                    </Text>
                    <Text style={styles.performanceLabel}>
                      Avg Students/Course
                    </Text>
                  </View>
                </View>
                <View style={styles.performanceDivider} />
                <View style={styles.performanceItem}>
                  <Icon name="trending-up" size={24} color="#52C787" />
                  <View style={styles.performanceContent}>
                    <Text style={styles.performanceValue}>
                      {courses.filter((c) => c.enrollmentCount > 0).length}
                    </Text>
                    <Text style={styles.performanceLabel}>Popular Courses</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Recent Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Courses</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("MyCoursesList")}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {courses.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="book-plus-outline" size={64} color="#D6EAF8" />
              <Text style={styles.emptyText}>No courses yet</Text>
              <Text style={styles.emptySubtext}>
                Create your first course to get started!
              </Text>
              <TouchableOpacity
                style={styles.createCourseButton}
                onPress={() => navigation.navigate("AddCourse")}
              >
                <Icon name="plus" size={20} color="#FFF" />
                <Text style={styles.createCourseButtonText}>Create Course</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {courses.slice(0, 3).map((course) => (
                <TouchableOpacity
                  key={course._id}
                  style={styles.courseCard}
                  onPress={() => navigation.navigate("EditCourse", { course })}
                >
                  <View style={styles.courseCardHeader}>
                    <View style={styles.courseThumbnail}>
                      <Icon
                        name="book-open-variant"
                        size={28}
                        color="#5DADE2"
                      />
                    </View>
                    <View style={styles.courseCardContent}>
                      <Text style={styles.courseTitle} numberOfLines={2}>
                        {course.title}
                      </Text>
                      <View style={styles.courseMeta}>
                        <View
                          style={[
                            styles.levelBadge,
                            getLevelColor(course.level),
                          ]}
                        >
                          <Text style={styles.levelText}>{course.level}</Text>
                        </View>
                        <Text style={styles.categoryText}>
                          {course.category}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.courseStats}>
                    <View style={styles.courseStat}>
                      <Icon name="account-group" size={16} color="#5499C7" />
                      <Text style={styles.courseStatText}>
                        {course.enrollmentCount || 0} students
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.viewStudentsButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        navigation.navigate("CourseStudents", {
                          courseId: course._id,
                        });
                      }}
                    >
                      <Text style={styles.viewStudentsText}>View Students</Text>
                      <Icon name="chevron-right" size={16} color="#5DADE2" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        {/* Teaching Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teaching Tips</Text>
          <View style={styles.tipCard}>
            <Icon name="lightbulb-on" size={24} color="#FFD93D" />
            <View style={styles.tipContent}>
              <Text style={styles.tipText}>
                Engage your students by adding interactive content and regular
                updates to your courses!
              </Text>
            </View>
          </View>
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
  content: {
    flex: 1,
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 5,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#7B68EE",
    fontWeight: "600",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  actionCard: {
    width: (width - 50) / 2,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    margin: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  actionIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
  },
  performanceCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  performanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  performanceItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  performanceContent: {
    marginLeft: 12,
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  performanceLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  performanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 15,
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
    textAlign: "center",
  },
  createCourseButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7B68EE",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  createCourseButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  courseCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  courseCardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  courseThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  courseCardContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  courseMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFF",
  },
  categoryText: {
    fontSize: 12,
    color: "#666666",
  },
  courseStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  courseStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  courseStatText: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 5,
    fontWeight: "500",
  },
  viewStudentsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewStudentsText: {
    fontSize: 13,
    color: "#7B68EE",
    fontWeight: "600",
    marginRight: 4,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFFCF0",
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD93D",
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipText: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
});

export default InstructorHomeScreen;
