import React, { useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import StudentStack from "./StudentStack";
import InstructorStack from "./InstructorStack";

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  useEffect(() => {
    console.log("🔍 MainNavigator State:", {
      isAuthenticated,
      loading,
      userRole: user?.role,
      userEmail: user?.email,
    });
  }, [isAuthenticated, user, loading]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF",
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : user?.role === "student" ? (
        <Stack.Screen
          name="Student"
          component={StudentStack}
          options={{ title: "Student Dashboard" }}
        />
      ) : (
        <Stack.Screen
          name="Instructor"
          component={InstructorStack}
          options={{ title: "Instructor Dashboard" }}
        />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
