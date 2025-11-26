import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

import CoursesScreen from "../screens/student/CoursesScreen";
import CourseDetailsScreen from "../screens/student/CourseDetailsScreen";
import EnrolledCoursesScreen from "../screens/student/EnrolledCoursesScreen";
import GPTChatScreen from "../screens/student/GPTChatScreen";
import ProfileScreen from "../screens/student/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Courses Stack (with navigation to details)
const CoursesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#007AFF" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="CoursesList"
      component={CoursesScreen}
      options={{ title: "All Courses" }}
    />
    <Stack.Screen
      name="CourseDetails"
      component={CourseDetailsScreen}
      options={{ title: "Course Details" }}
    />
  </Stack.Navigator>
);

// Enrolled Courses with Header
const EnrolledStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#007AFF" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="EnrolledList"
      component={EnrolledCoursesScreen}
      options={{ title: "My Courses" }}
    />
  </Stack.Navigator>
);

// GPT Chat with Header
const GPTStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#007AFF" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="GPTChat"
      component={GPTChatScreen}
      options={{ title: "AI Assistant" }}
    />
  </Stack.Navigator>
);

// Profile with Header
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#007AFF" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ title: "Profile" }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const StudentStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Courses") {
            iconName = focused ? "book-open" : "book-open-outline";
          } else if (route.name === "My Courses") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else if (route.name === "AI Assistant") {
            iconName = focused ? "robot" : "robot-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "account" : "account-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen name="Courses" component={CoursesStack} />
      <Tab.Screen name="My Courses" component={EnrolledStack} />
      <Tab.Screen name="AI Assistant" component={GPTStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default StudentStack;
