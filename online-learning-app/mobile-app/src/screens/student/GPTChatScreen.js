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
} from "react-native";
import { gptAPI } from "../../api";
import CustomHeader from "../../components/CustomHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

const GPTChatScreen = ({ navigation }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const quickPrompts = [
    {
      icon: "laptop",
      text: "I want to be a software engineer",
      color: "#007AFF",
    },
    { icon: "web", text: "I want to learn web development", color: "#5856D6" },
    {
      icon: "chart-line",
      text: "I want to become a data scientist",
      color: "#FF9500",
    },
    {
      icon: "cellphone",
      text: "I want to learn mobile app development",
      color: "#34C759",
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
      setError(err.response?.data?.message || "Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (quickPrompt) => {
    setPrompt(quickPrompt);
    handleGetRecommendations(quickPrompt);
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
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.aiAvatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="robot" size={50} color="#FFF" />
          </LinearGradient>
          <Text style={styles.aiGreeting}>
            Hi! I'm your AI learning assistant. Ask me what you want to learn!
          </Text>
        </View>

        {/* Quick Prompts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Questions:</Text>
          {quickPrompts.map((qp, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickPromptButton}
              onPress={() => handleQuickPrompt(qp.text)}
            >
              <View
                style={[styles.quickPromptIcon, { backgroundColor: qp.color }]}
              >
                <Icon name={qp.icon} size={20} color="#FFF" />
              </View>
              <Text style={styles.quickPromptText}>{qp.text}</Text>
              <Icon name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={24} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && !loading && (
          <View style={styles.section}>
            <View style={styles.recommendationsHeader}>
              <Icon name="lightbulb-on" size={24} color="#FFD700" />
              <Text style={styles.sectionTitle}>Recommendations for you:</Text>
            </View>
            {recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationCard}>
                <View style={styles.recommendationNumber}>
                  <Text style={styles.recommendationNumberText}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  <Text style={styles.recommendationReason}>{rec.reason}</Text>
                  {rec.course && (
                    <View style={styles.courseAvailable}>
                      <Icon name="check-circle" size={16} color="#34C759" />
                      <Text style={styles.availableText}>
                        Available in our catalog
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Icon
            name="message-text-outline"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor="#999"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            maxLength={200}
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
          <LinearGradient
            colors={
              !prompt.trim() || loading
                ? ["#CCC", "#999"]
                : ["#007AFF", "#0051D5"]
            }
            style={styles.sendGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="send" size={20} color="#FFF" />
          </LinearGradient>
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  aiGreeting: {
    fontSize: 16,
    color: "#666",
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
    color: "#333",
    marginBottom: 15,
    marginLeft: 5,
  },
  quickPromptButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
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
    color: "#333",
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: "#666",
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
    color: "#FF3B30",
    flex: 1,
    lineHeight: 20,
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  recommendationCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
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
    color: "#333",
    marginBottom: 6,
  },
  recommendationReason: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  courseAvailable: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  availableText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#34C759",
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    paddingBottom: 30,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
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
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
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
  },
});

export default GPTChatScreen;
