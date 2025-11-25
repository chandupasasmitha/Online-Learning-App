import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import StudentStack from "./StudentStack";
import InstructorStack from "./InstructorStack";

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : user?.role === "student" ? (
        <Stack.Screen name="Student" component={StudentStack} />
      ) : (
        <Stack.Screen name="Instructor" component={InstructorStack} />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
