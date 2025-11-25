// GPT chat screen
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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const GPTChatScreen = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const quickPrompts = [
    "I want to be a software engineer",
    "I want to learn web development",
    "I want to become a data scientist",
    "I want to learn mobile app development",
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
        // Handle text-only response
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
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Icon name="robot" size={40} color="#007AFF" />
        <Text style={styles.headerTitle}>AI Course Assistant</Text>
        <Text style={styles.headerSubtitle}>
          Ask me what courses you should take!
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Prompts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Prompts:</Text>
          {quickPrompts.map((qp, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickPromptButton}
              onPress={() => handleQuickPrompt(qp)}
            >
              <Icon name="lightning-bolt" size={16} color="#007AFF" />
              <Text style={styles.quickPromptText}>{qp}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommendations */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Getting recommendations...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={24} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {recommendations.length > 0 && !loading && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations:</Text>
            {recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationCard}>
                <Text style={styles.recommendationTitle}>{rec.title}</Text>
                <Text style={styles.recommendationReason}>{rec.reason}</Text>
                {rec.course && (
                  <View style={styles.courseInfo}>
                    <Icon name="check-circle" size={16} color="#4CAF50" />
                    <Text style={styles.availableText}>
                      Available in our catalog
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything... (e.g., I want to be a software engineer)"
          value={prompt}
          onChangeText={setPrompt}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={() => handleGetRecommendations()}
          disabled={loading}
        >
          <Icon name="send" size={24} color="#FFF" />
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
  header: {
    backgroundColor: "#FFF",
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  quickPromptButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  quickPromptText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#007AFF",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    backgroundColor: "#FFE5E5",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#FF3B30",
    flex: 1,
  },
  recommendationCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  recommendationReason: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  courseInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  availableText: {
    marginLeft: 5,
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default GPTChatScreen;
