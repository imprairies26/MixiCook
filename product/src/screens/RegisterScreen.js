import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { COLORS, TYPOGRAPHY, SPACING } from "../constants/Theme";
import { useAuthStore } from "../store/useAuthStore";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    const result = await register({ name, email, password });
    setLoading(false);

    if (result.success) {
      Alert.alert(
        "Thành công",
        "Đăng ký tài khoản thành công. Vui lòng đăng nhập.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }],
      );
    } else {
      Alert.alert("Lỗi", result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <LinearGradient
              colors={[COLORS.primary, "#34d399"]}
              style={styles.logoContainer}
            >
              <Feather name="user" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.brandTitle}>MixiCook</Text>
            <Text style={styles.brandSubtitle}>Tạo tài khoản mới</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Đăng ký</Text>
            <Text style={styles.formSubtitle}>
              Điền đầy đủ thông tin để tiếp tục
            </Text>

            <Input
              placeholder="Họ và tên"
              icon="user"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <Input
              placeholder="Email hoặc số điện thoại"
              icon="mail"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
            />

            <Input
              placeholder="Mật khẩu"
              icon="lock"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              rightIcon="eye"
            />

            <Input
              placeholder="Xác nhận mật khẩu"
              icon="lock"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              rightIcon="eye"
            />

            <Button
              title="ĐĂNG KÝ"
              onPress={handleRegister}
              style={styles.registerBtn}
            />

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>HOẶC</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Feather name="github" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Feather name="facebook" size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  brandTitle: {
    ...TYPOGRAPHY.h1,
    fontSize: 28,
    color: COLORS.text,
  },
  brandSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    padding: 30,
    borderRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.05,
    shadowRadius: 40,
    elevation: 10,
  },
  formTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 8,
  },
  formSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    marginBottom: 15,
  },
  input: {
    marginBottom: 16,
  },
  registerBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 16,
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 10,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 30,
  },
  socialBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
  },
  loginText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: "800",
  },
});
