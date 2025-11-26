import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@auth_token";
const USER_KEY = "@user_data";

// Token operations
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

// User operations
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error removing user:", error);
  }
};

// Clear all storage
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    console.log("✅ All storage cleared");
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

// Get all keys (for debugging)
export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error("Error getting all keys:", error);
    return [];
  }
};

// Clear everything (for debugging)
export const clearEverything = async () => {
  try {
    await AsyncStorage.clear();
    console.log("✅ Everything cleared");
  } catch (error) {
    console.error("Error clearing everything:", error);
  }
};
