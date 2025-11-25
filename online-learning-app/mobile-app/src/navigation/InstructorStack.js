import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import MyCoursesScreen from "../screens/instructor/MyCoursesScreen";
import AddCourseScreen from "../screens/instructor/AddCourseScreen";
import EditCourseScreen from "../screens/instructor/EditCourseScreen";
import CourseStudentsScreen from "../screens/instructor/CourseStudentsScreen";
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
      })}
    >
      <Tab.Screen name="My Courses" component={CoursesStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default InstructorStack;
