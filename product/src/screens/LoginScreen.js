import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/Theme';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginScreen({ navigation }) {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock user data
    login('dummy-token-123', { name: 'Mixi Cook', email: email });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <LinearGradient
              colors={[COLORS.primary, '#34d399']}
              style={styles.logoContainer}
            >
              <Feather name="coffee" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.brandTitle}>MixiCook</Text>
            <Text style={styles.brandSubtitle}>Personalized AI Cooking</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Đăng nhập</Text>
            <Text style={styles.formSubtitle}>Vui lòng nhập thông tin để tiếp tục.</Text>

            <Input
              placeholder="Email hoặc số điện thoại"
              icon="user"
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

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <Button 
              title="ĐĂNG NHẬP" 
              onPress={handleLogin}
              style={styles.loginBtn}
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
                <Feather name="twitter" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Feather name="facebook" size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('OTP')}>
                <Text style={styles.signupText}>Đăng ký ngay</Text>
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
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    letterSpacing: 2,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    padding: 30,
    borderRadius: 32,
    shadowColor: '#000',
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
    marginBottom: 30,
  },
  input: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '700',
  },
  loginBtn: {
    marginBottom: 24,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 30,
  },
  socialBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
  },
  signupText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '800',
  },
});
