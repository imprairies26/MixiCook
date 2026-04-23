import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { LinearGradient } from 'expo-linear-gradient';

export default function OTPScreen({ navigation }) {
  // Simple fake OTP component layout
  return (
    <SafeAreaView style={styles.container}>
      <Header title="" showBack />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSection}>
            <LinearGradient
              colors={['#10b981', '#34d399']}
              style={styles.iconContainer}
            >
              <Text style={styles.iconIcon}>✓</Text>
            </LinearGradient>
            <Text style={styles.title}>Xác thực OTP</Text>
            <Text style={styles.subtitle}>
              Chúng tôi đã gửi mã xác thực tới email của bạn. Vui lòng kiểm tra và nhập vào bên dưới.
            </Text>
          </View>

          <View style={styles.otpContainer}>
            {/* Fake OTP Inputs */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <View key={i} style={styles.otpBox}>
                <Text style={styles.otpText}>{i === 1 ? '1' : ''}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionSection}>
            <Button 
              title="Xác nhận" 
              onPress={() => navigation.navigate('Login')}
            />
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Chưa nhận được mã? </Text>
              <TouchableOpacity>
                <Text style={styles.resendLink}>Gửi lại (00:59)</Text>
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
    backgroundColor: '#F8F9FA',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 48,
  },
  otpBox: {
    width: 48,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  otpText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  actionSection: {
    gap: 32,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resendText: {
    color: '#6B7280',
    fontSize: 14,
  },
  resendLink: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
});
