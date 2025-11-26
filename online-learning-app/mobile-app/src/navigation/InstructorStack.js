import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

import InstructorHomeScreen from "../screens/instructor/InstructorHomeScreen";
import MyCoursesScreen from "../screens/instructor/MyCoursesScreen";
import AddCourseScreen from "../screens/instructor/AddCourseScreen";
import EditCourseScreen from "../screens/instructor/EditCourseScreen";
import CourseStudentsScreen from "../screens/instructor/CourseStudentsScreen";
import ProfileScreen from "../screens/student/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="InstructorHomeMain" component={InstructorHomeScreen} />
  </Stack.Navigator>
);

// Courses Stack with nested screens
const CoursesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyCoursesList" component={MyCoursesScreen} />
    <Stack.Screen name="AddCourse" component={AddCourseScreen} />
    <Stack.Screen name="EditCourse" component={EditCourseScreen} />
    <Stack.Screen name="CourseStudents" component={CourseStudentsScreen} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const InstructorStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "My Courses") {
            iconName = focused ? "book-multiple" : "book-multiple-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "account-circle" : "account-circle-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#7B68EE",
        tabBarInactiveTintColor: "#999999",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
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
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="My Courses" component={CoursesStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default InstructorStack;
