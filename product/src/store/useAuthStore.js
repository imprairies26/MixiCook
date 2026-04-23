import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set) => ({
  user: null,
  userToken: null,
  isOnboarded: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const onboarded = await AsyncStorage.getItem('isOnboarded');
      set({ 
        userToken: token, 
        isOnboarded: onboarded === 'true',
        isLoading: false 
      });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  login: async (token, userData) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      set({ userToken: token, user: userData });
    } catch (e) {
      console.error(e);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      set({ userToken: null, user: null });
    } catch (e) {
      console.error(e);
    }
  },

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem('isOnboarded', 'true');
      set({ isOnboarded: true });
    } catch (e) {
      console.error(e);
    }
  }
}));
