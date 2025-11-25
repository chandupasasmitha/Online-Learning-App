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
      })}
    >
      <Tab.Screen name="Courses" component={CoursesStack} />
      <Tab.Screen name="My Courses" component={EnrolledCoursesScreen} />
      <Tab.Screen name="AI Assistant" component={GPTChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default StudentStack;
