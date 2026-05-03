import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/useAuthStore';
import { COLORS } from '../constants/Theme';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OTPScreen from '../screens/OTPScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

import HomeScreen from '../screens/HomeScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import IngredientPickerScreen from '../screens/IngredientPickerScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import CookingModeScreen from '../screens/CookingModeScreen';
import PostRecipeScreen from '../screens/PostRecipeScreen';

import FridgeScreen from '../screens/FridgeScreen';
import ProfileScreen from '../screens/ProfileScreen';

import CustomTabBar from './CustomTabBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Khám phá' }} />
      <Tab.Screen name="FridgeTab" component={FridgeScreen} options={{ title: 'Tủ lạnh' }} />
      <Tab.Screen name="RecipeTab" component={PostRecipeScreen} options={{ title: 'Đăng bài' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Cá nhân' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoading, userToken, isOnboarded } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        // auth flow 
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        // main flow
        <>
          {!isOnboarded ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : null}
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="SearchResult" component={SearchResultScreen} />
          <Stack.Screen name="IngredientPicker" component={IngredientPickerScreen} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
          <Stack.Screen name="CookingMode" component={CookingModeScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
