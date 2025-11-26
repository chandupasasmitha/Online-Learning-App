import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { gptAPI, courseAPI } from "../../api";
import CustomHeader from "../../components/CustomHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const GPTChatScreen = ({ navigation }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [allCourses, setAllCourses] = useState([]);

  const quickPrompts = [
    {
      icon: "laptop",
      text: "I want to be a software engineer",
      color: "#5DADE2",
    },
    { icon: "web", text: "I want to learn web development", color: "#9D7CD8" },
    {
      icon: "chart-line",
      text: "I want to become a data scientist",
      color: "#FFB84D",
    },
    {
      icon: "cellphone",
      text: "I want to learn mobile app development",
      color: "#52C787",
    },
  ];

  const handleGetRecommendations = async (customPrompt) => {
    const searchPrompt = customPrompt || prompt;

    if (!searchPrompt.trim()) {
      setError("Please enter a prompt or select a quick prompt");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await gptAPI.getCourseRecommendations(searchPrompt);
      const data = response.data.data;

      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);

        // Fetch all courses to display them
        const coursesRes = await courseAPI.getAllCourses();
        setAllCourses(coursesRes.data.data.courses);
      } else if (data.rawResponse) {
        setRecommendations([
          {
            title: "AI Recommendations",
            reason: data.rawResponse,
            course: null,
          },
        ]);
      } else {
        setError("No recommendations found. Try a different prompt.");
      }
    } catch (err) {
      console.error("GPT Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to get recommendations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (quickPrompt) => {
    setPrompt(quickPrompt);
    handleGetRecommendations(quickPrompt);
  };

  const handleCoursePress = (course) => {
    if (course && course._id) {
      navigation.navigate("Explore", {
        screen: "CourseDetails",
        params: { courseId: course._id },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={0}
    >
      <CustomHeader
        title="AI Course Assistant"
        subtitle="Get personalized recommendations"
        navigation={navigation}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* AI Avatar */}
        <View style={styles.aiAvatarContainer}>
          <View style={styles.aiAvatar}>
            <Icon name="robot" size={50} color="#FFF" />
          </View>
          <Text style={styles.aiGreeting}>
            Hi! I'm your AI learning assistant. Ask me what you want to learn!
          </Text>
        </View>

        {/* Quick Prompts */}
        {recommendations.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Questions:</Text>
            {quickPrompts.map((qp, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickPromptButton}
                onPress={() => handleQuickPrompt(qp.text)}
              >
                <View
                  style={[
                    styles.quickPromptIcon,
                    { backgroundColor: qp.color },
                  ]}
                >
                  <Icon name={qp.icon} size={20} color="#FFF" />
                </View>
                <Text style={styles.quickPromptText}>{qp.text}</Text>
                <Icon name="chevron-right" size={20} color="#CCCCCC" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5DADE2" />
            <Text style={styles.loadingText}>
              AI is analyzing and finding best courses for you...
            </Text>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={24} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && !loading && (
          <View style={styles.section}>
            <View style={styles.recommendationsHeader}>
              <Icon name="lightbulb-on" size={24} color="#FFD93D" />
              <Text style={styles.sectionTitle}>AI Recommendations:</Text>
            </View>

            {recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationCard}>
                <View style={styles.recommendationHeader}>
                  <View style={styles.recommendationNumber}>
                    <Text style={styles.recommendationNumberText}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationTitle}>{rec.title}</Text>
                    <Text style={styles.recommendationReason}>
                      {rec.reason}
                    </Text>
                  </View>
                </View>

                {/* Show available course if found */}
                {rec.course && (
                  <TouchableOpacity
                    style={styles.courseAvailableCard}
                    onPress={() => handleCoursePress(rec.course)}
                  >
                    <View style={styles.courseThumbnail}>
                      <Icon name="book" size={24} color="#5DADE2" />
                    </View>
                    <View style={styles.courseInfo}>
                      <View style={styles.availableBadge}>
                        <Icon name="check-circle" size={14} color="#52C787" />
                        <Text style={styles.availableText}>
                          Available in Catalog
                        </Text>
                      </View>
                      <Text style={styles.courseTitle} numberOfLines={2}>
                        {rec.course.title}
                      </Text>
                      <Text style={styles.courseInstructor} numberOfLines={1}>
                        {rec.course.instructor?.fullName ||
                          rec.course.instructor?.username}
                      </Text>
                      <View style={styles.courseMeta}>
                        <View style={styles.levelBadge}>
                          <Text style={styles.levelText}>
                            {rec.course.level}
                          </Text>
                        </View>
                        <Text style={styles.categoryText}>
                          {rec.course.category}
                        </Text>
                      </View>
                    </View>
                    <Icon name="chevron-right" size={24} color="#CCCCCC" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Browse All Courses Button */}
            <TouchableOpacity
              style={styles.browseAllButton}
              onPress={() => navigation.navigate("Explore")}
            >
              <Icon name="compass-outline" size={20} color="#5DADE2" />
              <Text style={styles.browseAllText}>Browse All Courses</Text>
            </TouchableOpacity>

            {/* Try Another Search Button */}
            <TouchableOpacity
              style={styles.tryAnotherButton}
              onPress={() => {
                setRecommendations([]);
                setPrompt("");
                setError("");
              }}
            >
              <Icon name="refresh" size={20} color="#5499C7" />
              <Text style={styles.tryAnotherText}>Try Another Search</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Icon
            name="message-text-outline"
            size={20}
            color="#666666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Ask me anything... (e.g., I want to learn Python)"
            placeholderTextColor="#999999"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            maxLength={200}
            editable={!loading}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!prompt.trim() || loading) && styles.sendButtonDisabled,
          ]}
          onPress={() => handleGetRecommendations()}
          disabled={!prompt.trim() || loading}
        >
          <View style={styles.sendGradient}>
            <Icon name="send" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  aiAvatarContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  aiAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#7B68EE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  aiGreeting: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 15,
    marginLeft: 5,
  },
  quickPromptButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  quickPromptIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  quickPromptText: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: "#FFE5E5",
    padding: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    marginLeft: 15,
    fontSize: 14,
    color: "#FF6B6B",
    flex: 1,
    lineHeight: 20,
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  recommendationCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  recommendationNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7B68EE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recommendationNumberText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 6,
  },
  recommendationReason: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  courseAvailableCard: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  courseThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  availableText: {
    marginLeft: 4,
    fontSize: 11,
    color: "#52C787",
    fontWeight: "600",
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 2,
  },
  courseInstructor: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  courseMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#555555",
  },
  categoryText: {
    fontSize: 11,
    color: "#666666",
  },
  browseAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  browseAllText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#7B68EE",
    fontWeight: "600",
  },
  tryAnotherButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  tryAnotherText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#666666",
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    alignItems: "flex-end",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333333",
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7B68EE",
    borderRadius: 22,
  },
});

export default GPTChatScreen;
