import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MOCK_USERS = [
  { id: "1", name: "Mixi Cook", email: "admin@mixicook.com", password: "123" },
  {
    id: "2",
    name: "Caveman Chef",
    email: "caveman@mixicook.com",
    password: "abc",
  },
];

export const useAuthStore = create((set, get) => ({
  user: null,
  userToken: null,
  isOnboarded: false,
  isLoading: true,
  registeredUsers: [],

  checkAuth: async () => {
    try {
      // Load registered users from storage or use defaults
      const storedUsers = await AsyncStorage.getItem("registeredUsers");
      let users = storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;

      const token = await AsyncStorage.getItem("userToken");
      const onboarded = await AsyncStorage.getItem("isOnboarded");
      const storedUser = await AsyncStorage.getItem("userData");

      set({
        registeredUsers: users,
        userToken: token,
        user: storedUser ? JSON.parse(storedUser) : null,
        isOnboarded: onboarded === "true",
        isLoading: false,
      });
    } catch (e) {
      console.error("Failed to init auth store", e);
      set({ isLoading: false });
    }
  },

  register: async (userData) => {
    try {
      const { registeredUsers } = get();
      const newUser = {
        id: Date.now().toString(),
        ...userData,
      };

      const updatedUsers = [...registeredUsers, newUser];
      await AsyncStorage.setItem(
        "registeredUsers",
        JSON.stringify(updatedUsers),
      );

      set({ registeredUsers: updatedUsers });
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Đăng ký thất bại" };
    }
  },

  login: async (email, password) => {
    try {
      const { registeredUsers } = get();
      const foundUser = registeredUsers.find(
        (u) => u.email === email && u.password === password,
      );

      if (foundUser) {
        const token = `dummy-token-${foundUser.id}`;
        // Don't store password in session
        const { password: _, ...userSession } = foundUser;

        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userData", JSON.stringify(userSession));

        set({ userToken: token, user: userSession });
        return { success: true };
      } else {
        return { success: false, message: "Sai thông tin đăng nhập" };
      }
    } catch (e) {
      console.error(e);
      return { success: false, message: "Đăng nhập thất bại" };
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      // Reset state
      set({ userToken: null, user: null });
      // In a real app, we might use Updates.reloadAsync() from expo-updates for a full restart
    } catch (e) {
      console.error(e);
    }
  },

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem("isOnboarded", "true");
      set({ isOnboarded: true });
    } catch (e) {
      console.error(e);
    }
  },

  syncUser: () => {
    const { user, registeredUsers } = get();
    if (user) {
      const updatedInfo = registeredUsers.find((u) => u.id === user.id);
      if (updatedInfo) {
        const { password: _, ...userSession } = updatedInfo;
        set({ user: userSession });
      }
    }
  },
}));
