import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

import MyCoursesScreen from "../screens/instructor/MyCoursesScreen";
import AddCourseScreen from "../screens/instructor/AddCourseScreen";
import EditCourseScreen from "../screens/instructor/EditCourseScreen";
import CourseStudentsScreen from "../screens/instructor/CourseStudentsScreen";
import ProfileScreen from "../screens/student/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Courses Stack with nested screens
const CoursesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#007AFF" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="MyCoursesList"
      component={MyCoursesScreen}
      options={{ title: "My Courses" }}
    />
    <Stack.Screen
      name="AddCourse"
      component={AddCourseScreen}
      options={{ title: "Create Course" }}
    />
    <Stack.Screen
      name="EditCourse"
      component={EditCourseScreen}
      options={{ title: "Edit Course" }}
    />
    <Stack.Screen
      name="CourseStudents"
      component={CourseStudentsScreen}
      options={{ title: "Enrolled Students" }}
    />
  </Stack.Navigator>
);

// Profile Stack
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
const InstructorStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "My Courses") {
            iconName = focused ? "book-multiple" : "book-multiple-outline";
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
      <Tab.Screen name="My Courses" component={CoursesStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default InstructorStack;
