import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CourseCard = ({ course, onPress, isEnrolled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.card, isEnrolled && styles.cardEnrolled]}
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>
          {isEnrolled && (
            <View style={styles.enrolledBadgeSmall}>
              <Icon name="check-circle" size={14} color="#52C787" />
              <Text style={styles.enrolledTextSmall}>You're enrolled</Text>
            </View>
          )}
        </View>
        <View style={[styles.levelBadge, getLevelColor(course.level)]}>
          <Text style={styles.levelText}>{course.level}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {course.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <Icon name="account" size={16} color="#5499C7" />
          <Text style={styles.infoText} numberOfLines={1}>
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
          <Icon name="account-group" size={16} color="#5DADE2" />
          <Text style={styles.enrollmentText}>
            {course.enrollmentCount} students
          </Text>
        </View>
      )}
    </TouchableOpacity>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardEnrolled: {
    borderLeftWidth: 4,
    borderLeftColor: "#52C787",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  titleSection: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    lineHeight: 24,
    marginBottom: 6,
  },
  enrolledBadgeSmall: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  enrolledTextSmall: {
    fontSize: 12,
    color: "#52C787",
    fontWeight: "600",
    marginLeft: 4,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    minWidth: 85,
    alignItems: "center",
  },
  levelText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  infoText: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 5,
  },
  categoryBadge: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "#555555",
    fontSize: 12,
    fontWeight: "500",
  },
  enrollmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  enrollmentText: {
    fontSize: 13,
    color: "#7B68EE",
    marginLeft: 5,
    fontWeight: "500",
  },
});

export default CourseCard;
