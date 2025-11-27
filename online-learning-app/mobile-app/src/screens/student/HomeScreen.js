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
import { courseAPI, enrollmentAPI } from "../../api";
import CustomHeader from "../../components/CustomHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const enrollmentsRes = await enrollmentAPI.getMyEnrollments();
      setEnrollments(enrollmentsRes.data.data.enrollments);

      const coursesRes = await courseAPI.getAllCourses();
      setRecommendedCourses(coursesRes.data.data.courses.slice(0, 5));
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
      icon: "book-search",
      label: "Browse Courses",
      color: "#5DADE2",
      screen: "Explore",
    },
    {
      id: 2,
      icon: "bookmark-multiple",
      label: "My Courses",
      color: "#52C787",
      screen: "My Courses",
    },
    {
      id: 3,
      icon: "certificate",
      label: "Certificates",
      color: "#FFB84D",
      screen: null,
    },
    {
      id: 4,
      icon: "account-group",
      label: "Community",
      color: "#9D7CD8",
      screen: null,
    },
  ];

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
        title={`Welcome back, ${
          user?.fullName?.split(" ")[0] || user?.username
        }!`}
        subtitle="Ready to learn something new today?"
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
        {/* AI Assistant Section - Navigate to GPT Screen */}
        <TouchableOpacity
          style={styles.aiSection}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("AI Assistant")}
        >
          <View style={styles.aiHeader}>
            <View style={styles.aiIconContainer}>
              <Icon name="robot" size={30} color="#FFF" />
            </View>
            <View style={styles.aiHeaderText}>
              <Text style={styles.aiTitle}>AI Learning Assistant</Text>
              <Text style={styles.aiSubtitle}>
                Get personalized course recommendations
              </Text>
            </View>
            <Icon name="chevron-right" size={28} color="#5DADE2" />
          </View>

          <View style={styles.aiPromptPreview}>
            <Icon
              name="sparkles"
              size={18}
              color="#888888"
              style={styles.sparkleIcon}
            />
            <Text style={styles.aiPromptText}>
              "I want to be a software engineer..."
            </Text>
          </View>

          <View style={styles.aiFeatures}>
            <View style={styles.aiFeature}>
              <Icon name="check-circle" size={16} color="#52C787" />
              <Text style={styles.aiFeatureText}>Personalized suggestions</Text>
            </View>
            <View style={styles.aiFeature}>
              <Icon name="check-circle" size={16} color="#52C787" />
              <Text style={styles.aiFeatureText}>Course matching</Text>
            </View>
            <View style={styles.aiFeature}>
              <Icon name="check-circle" size={16} color="#52C787" />
              <Text style={styles.aiFeatureText}>Career guidance</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Icon name="book-open-page-variant" size={28} color="#5DADE2" />
            <Text style={styles.statNumber}>{enrollments.length}</Text>
            <Text style={styles.statLabel}>Enrolled Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="trophy" size={28} color="#FFD93D" />
            <Text style={styles.statNumber}>
              {enrollments.filter((e) => e.status === "completed").length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="clock-outline" size={28} color="#52C787" />
            <Text style={styles.statNumber}>
              {enrollments.filter((e) => e.status === "active").length}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
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
                onPress={() => {
                  if (action.screen) {
                    navigation.navigate(action.screen);
                  }
                }}
              >
                <View
                  style={[styles.actionIcon, { backgroundColor: action.color }]}
                >
                  <Icon name={action.icon} size={24} color="#FFF" />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Learning */}
        {enrollments.filter((e) => e.status === "active").length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Continue Learning</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("My Courses")}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {enrollments
                .filter((e) => e.status === "active")
                .slice(0, 3)
                .map((enrollment) => (
                  <TouchableOpacity
                    key={enrollment._id}
                    style={styles.courseCard}
                    onPress={() =>
                      navigation.navigate("Explore", {
                        screen: "CourseDetails",
                        params: { courseId: enrollment.course?._id },
                      })
                    }
                  >
                    <View style={styles.courseCardHeader}>
                      <View style={styles.courseThumbnail}>
                        <Icon
                          name="book-open-variant"
                          size={30}
                          color="#5DADE2"
                        />
                      </View>
                      <View style={styles.progressBadge}>
                        <Text style={styles.progressText}>
                          {enrollment.progress}%
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.courseTitle} numberOfLines={2}>
                      {enrollment.course?.title}
                    </Text>
                    <Text style={styles.courseInstructor} numberOfLines={1}>
                      {enrollment.course?.instructor?.fullName}
                    </Text>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${enrollment.progress}%` },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}

        {/* Recommended Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Explore")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {recommendedCourses.slice(0, 3).map((course) => (
            <TouchableOpacity
              key={course._id}
              style={styles.recommendedCard}
              onPress={() =>
                navigation.navigate("Explore", {
                  screen: "CourseDetails",
                  params: { courseId: course._id },
                })
              }
            >
              <View style={styles.recommendedThumbnail}>
                <Icon name="book" size={32} color="#5DADE2" />
              </View>
              <View style={styles.recommendedContent}>
                <Text style={styles.recommendedTitle} numberOfLines={2}>
                  {course.title}
                </Text>
                <Text style={styles.recommendedInstructor} numberOfLines={1}>
                  {course.instructor?.fullName || course.instructor?.username}
                </Text>
                <View style={styles.recommendedFooter}>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{course.level}</Text>
                  </View>
                  <Text style={styles.categoryText}>{course.category}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Learning Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Tips</Text>
          <View style={styles.tipCard}>
            <Icon name="lightbulb-on" size={24} color="#FFD93D" />
            <Text style={styles.tipText}>
              Set aside 30 minutes daily for consistent learning progress!
            </Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
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
  content: {
    flex: 1,
  },
  // AI Assistant Section - Now as a navigation card
  aiSection: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  aiIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7B68EE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  aiHeaderText: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 13,
    color: "#666666",
  },
  aiPromptPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sparkleIcon: {
    marginRight: 10,
  },
  aiPromptText: {
    fontSize: 14,
    color: "#888888",
    fontStyle: "italic",
  },
  aiFeatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  aiFeature: {
    flexDirection: "row",
    alignItems: "center",
  },
  aiFeatureText: {
    fontSize: 11,
    color: "#666666",
    marginLeft: 4,
  },
  // Stats Section
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
    textAlign: "center",
  },
  // Sections
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
  // Quick Actions
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
    width: 60,
    height: 60,
    borderRadius: 30,
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
  // Course Cards
  courseCard: {
    width: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  courseCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  courseThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBadge: {
    backgroundColor: "#5DADE2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    height: 24,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 6,
    height: 38,
  },
  courseInstructor: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#D6EAF8",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#5DADE2",
    borderRadius: 3,
  },
  // Recommended Courses
  recommendedCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  recommendedThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  recommendedContent: {
    flex: 1,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  recommendedInstructor: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 8,
  },
  recommendedFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelBadge: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#555555",
  },
  categoryText: {
    fontSize: 12,
    color: "#666666",
  },
  // Tip Card
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFFCF0",
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD93D",
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
});

export default HomeScreen;
