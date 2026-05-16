import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/common/Header";
import { Feather } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";
import { useShoppingStore } from "../store/useShoppingStore";
import Button from "../components/common/Button";
import { COLORS, TYPOGRAPHY, SPACING } from "../constants/Theme";

export default function ProfileScreen({ navigation }) {
  const { logout, user, syncUser } = useAuthStore();
  const { shoppingList } = useShoppingStore();
  const cartCount = shoppingList.filter(i => !i.checked).length;

  useEffect(() => {
    // Sync user data with "mock database" on mount
    syncUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    // Resetting state in AuthStore will trigger AppNavigator to show Login screen
  };

  const menuItems = [
    {
      icon: "heart",
      label: "Món ăn đã lưu",
      count: null,
      onPress: () => Alert.alert("Tính năng sắp ra mắt", "Danh sách món ăn đã lưu sẽ có trong phiên bản tiếp theo."),
    },
    {
      icon: "shopping-cart",
      label: "Giỏ đi chợ",
      count: cartCount || null,
      onPress: () => navigation.navigate('ShoppingCart'),
    },
    {
      icon: "clock",
      label: "Lịch sử nấu nướng",
      count: null,
      onPress: () => Alert.alert("Tính năng sắp ra mắt", "Lịch sử nấu nướng sẽ có trong phiên bản tiếp theo."),
    },
    {
      icon: "settings",
      label: "Cài đặt tài khoản",
      onPress: () => Alert.alert("Tính năng sắp ra mắt", "Trang cài đặt sẽ có trong phiên bản tiếp theo."),
    },
    {
      icon: "help-circle",
      label: "Trung tâm trợ giúp",
      onPress: () => Alert.alert("Trợ giúp", "Liên hệ hỗ trợ: support@mixicook.com"),
    },
  ];


  return (
    <SafeAreaView style={styles.container}>
      <Header title="Cá nhân" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Feather name="user" size={48} color={COLORS.primary} />
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <Feather name="edit-2" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.name || "Mixi User"}</Text>
          <Text style={styles.email}>{user?.email || "user@mixicook.com"}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Bài đăng</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1.2k</Text>
              <Text style={styles.statLabel}>Người theo dõi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>850</Text>
              <Text style={styles.statLabel}>Đang theo dõi</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Feather name={item.icon} size={20} color={COLORS.text} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.count && (
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{item.count}</Text>
                </View>
              )}
              <Feather name="chevron-right" size={18} color={COLORS.border} />
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="ĐĂNG XUẤT"
          variant="outline"
          icon={<Feather name="log-out" size={18} color={COLORS.error} />}
          onPress={handleLogout}
          textStyle={{ color: COLORS.error }}
          style={styles.logoutBtn}
        />

        <Text style={styles.version}>MixiCook v1.0.0 (Beta)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  editBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  name: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    fontSize: 24,
  },
  email: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    color: COLORS.text,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  menuSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 8,
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "600",
  },
  countBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  countText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontSize: 12,
  },
  logoutBtn: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  version: {
    textAlign: "center",
    marginTop: 32,
    ...TYPOGRAPHY.caption,
    color: COLORS.border,
  },
});
