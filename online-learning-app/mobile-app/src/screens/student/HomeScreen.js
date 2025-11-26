import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Dimensions,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { courseAPI, enrollmentAPI, gptAPI } from "../../api";
import CustomHeader from "../../components/CustomHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch enrollments
      const enrollmentsRes = await enrollmentAPI.getMyEnrollments();
      setEnrollments(enrollmentsRes.data.data.enrollments);

      // Fetch recommended courses
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

  const handleAiSearch = async () => {
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    setShowAiSuggestions(true);
    try {
      const response = await gptAPI.getCourseRecommendations(aiPrompt);
      // Handle AI response - you can show in modal or navigate to results
      console.log("AI Recommendations:", response.data.data);
      navigation.navigate("AI Assistant");
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const quickActions = [
    {
      id: 1,
      icon: "book-search",
      label: "Browse Courses",
      color: "#007AFF",
      screen: "Explore",
    },
    {
      id: 2,
      icon: "bookmark-multiple",
      label: "My Courses",
      color: "#34C759",
      screen: "My Courses",
    },
    {
      id: 3,
      icon: "certificate",
      label: "Certificates",
      color: "#FF9500",
      screen: null,
    },
    {
      id: 4,
      icon: "account-group",
      label: "Community",
      color: "#5856D6",
      screen: null,
    },
  ];

  const aiSuggestions = [
    "I want to learn web development",
    "Suggest courses for data science",
    "Best courses for beginners",
    "I want to be a mobile developer",
  ];

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
        {/* AI Assistant Section */}
        <View style={styles.aiSection}>
          <View style={styles.aiHeader}>
            <View style={styles.aiIconContainer}>
              <Icon name="robot" size={24} color="#FFF" />
            </View>
            <View style={styles.aiHeaderText}>
              <Text style={styles.aiTitle}>AI Learning Assistant</Text>
              <Text style={styles.aiSubtitle}>Ask me anything!</Text>
            </View>
          </View>

          <View style={styles.aiInputContainer}>
            <Icon
              name="sparkles"
              size={20}
              color="#007AFF"
              style={styles.aiInputIcon}
            />
            <TextInput
              style={styles.aiInput}
              placeholder="What do you want to learn today?"
              placeholderTextColor="#999"
              value={aiPrompt}
              onChangeText={setAiPrompt}
              onFocus={() => setShowAiSuggestions(true)}
            />
            {aiLoading ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <TouchableOpacity onPress={handleAiSearch}>
                <Icon name="send-circle" size={32} color="#007AFF" />
              </TouchableOpacity>
            )}
          </View>

          {showAiSuggestions && (
            <View style={styles.aiSuggestions}>
              <Text style={styles.suggestionsTitle}>Try asking:</Text>
              <View style={styles.suggestionsGrid}>
                {aiSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionChip}
                    onPress={() => {
                      setAiPrompt(suggestion);
                      setShowAiSuggestions(false);
                    }}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Icon name="book-open-page-variant" size={28} color="#007AFF" />
            <Text style={styles.statNumber}>{enrollments.length}</Text>
            <Text style={styles.statLabel}>Enrolled Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="trophy" size={28} color="#FFD700" />
            <Text style={styles.statNumber}>
              {enrollments.filter((e) => e.status === "completed").length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="clock-outline" size={28} color="#34C759" />
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
                    onPress={() => navigation.navigate("My Courses")}
                  >
                    <View style={styles.courseCardHeader}>
                      <View style={styles.courseThumbnail}>
                        <Icon
                          name="book-open-variant"
                          size={30}
                          color="#007AFF"
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
                <Icon name="book" size={32} color="#007AFF" />
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
              <Icon name="chevron-right" size={24} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Learning Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Tips</Text>
          <View style={styles.tipCard}>
            <Icon name="lightbulb-on" size={24} color="#FFD700" />
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
  // AI Section
  aiSection: {
    backgroundColor: "#FFF",
    margin: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  aiIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  aiHeaderText: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  aiSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  aiInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  aiInputIcon: {
    marginRight: 10,
  },
  aiInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    paddingVertical: 8,
  },
  aiSuggestions: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  suggestionsTitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  suggestionChip: {
    backgroundColor: "#F0F7FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  suggestionText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  // Stats Section
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
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
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#007AFF",
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
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    color: "#333",
    textAlign: "center",
  },
  // Course Cards
  courseCard: {
    width: 200,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBadge: {
    backgroundColor: "#007AFF",
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
    color: "#333",
    marginBottom: 6,
    height: 38,
  },
  courseInstructor: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 3,
  },
  // Recommended Courses
  recommendedCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recommendedThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#F0F7FF",
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
    color: "#333",
    marginBottom: 4,
  },
  recommendedInstructor: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  recommendedFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#007AFF",
  },
  categoryText: {
    fontSize: 12,
    color: "#999",
  },
  // Tip Card
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFFBEA",
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});

export default HomeScreen;
