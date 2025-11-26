// CourseCard component
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

const CourseCard = ({ course, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
        <View style={[styles.levelBadge, getLevelColor(course.level)]}>
          <Text style={styles.levelText}>{course.level}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {course.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <Icon name="account" size={16} color="#666" />
          <Text style={styles.infoText}>
            {course.instructor?.fullName ||
              course.instructor?.username ||
              "Unknown"}
          </Text>
        </View>

        {course.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{course.category}</Text>
          </View>
        )}
      </View>

      {course.enrollmentCount !== undefined && (
        <View style={styles.enrollmentInfo}>
          <Icon name="account-group" size={16} color="#007AFF" />
          <Text style={styles.enrollmentText}>
            {course.enrollmentCount} enrolled
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const getLevelColor = (level) => {
  switch (level) {
    case "Beginner":
      return { backgroundColor: "#4CAF50" };
    case "Intermediate":
      return { backgroundColor: "#FF9800" };
    case "Advanced":
      return { backgroundColor: "#F44336" };
    default:
      return { backgroundColor: "#9E9E9E" };
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  levelText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
  },
  categoryBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "500",
  },
  enrollmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  enrollmentText: {
    fontSize: 13,
    color: "#007AFF",
    marginLeft: 5,
    fontWeight: "500",
  },
});

export default CourseCard;
