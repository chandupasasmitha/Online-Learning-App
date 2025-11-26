import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";

// Import screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import CoursesScreen from "../screens/student/CoursesScreen";
import CourseDetailsScreen from "../screens/student/CourseDetailsScreen";
import EnrolledCoursesScreen from "../screens/student/EnrolledCoursesScreen";
import GPTChatScreen from "../screens/student/GPTChatScreen";
import AddCourseScreen from "../screens/instructor/AddCourseScreen";
import MyCoursesScreen from "../screens/instructor/MyCoursesScreen";
import EditCourseScreen from "../screens/instructor/EditCourseScreen";

const Stack = createStackNavigator();

export default function MainStack() {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    return null; // Or a loading screen
  }

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }

  // Student screens
  if (user?.role === "student") {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
        <Stack.Screen
          name="EnrolledCourses"
          component={EnrolledCoursesScreen}
        />
        <Stack.Screen name="GPTChat" component={GPTChatScreen} />
      </Stack.Navigator>
    );
  }

  // Instructor screens
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyCourses" component={MyCoursesScreen} />
      <Stack.Screen name="AddCourse" component={AddCourseScreen} />
      <Stack.Screen name="EditCourse" component={EditCourseScreen} />
    </Stack.Navigator>
  );
}
