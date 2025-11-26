import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import CoursesScreen from "../screens/student/CoursesScreen";
import CourseDetailsScreen from "../screens/student/CourseDetailsScreen";
import EnrolledCoursesScreen from "../screens/student/EnrolledCoursesScreen";
import GPTChatScreen from "../screens/student/GPTChatScreen";
import ProfileScreen from "../screens/student/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Courses Stack
const CoursesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CoursesList" component={CoursesScreen} />
    <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
  </Stack.Navigator>
);

// Enrolled Courses Stack
const EnrolledStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EnrolledList" component={EnrolledCoursesScreen} />
  </Stack.Navigator>
);

// GPT Stack
const GPTStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GPTChat" component={GPTChatScreen} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
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
            iconName = focused
              ? "bookmark-multiple"
              : "bookmark-multiple-outline";
          } else if (route.name === "AI Assistant") {
            iconName = focused ? "robot" : "robot-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "account-circle" : "account-circle-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      })}
    >
      <Tab.Screen
        name="Courses"
        component={CoursesStack}
        options={{
          tabBarLabel: "Explore",
        }}
      />
      <Tab.Screen
        name="My Courses"
        component={EnrolledStack}
        options={{
          tabBarLabel: "My Courses",
        }}
      />
      <Tab.Screen
        name="AI Assistant"
        component={GPTStack}
        options={{
          tabBarLabel: "AI Helper",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentStack;
