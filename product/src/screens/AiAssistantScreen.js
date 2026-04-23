import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/common/Header';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../constants/Theme';
import Button from '../components/common/Button';

export default function AiAssistantScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="MixiCook AI" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="cpu" size={56} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Hệ thống Dự đoán Thông minh</Text>
        <Text style={styles.subtitle}>
          MixiCook sử dụng học máy để phân tích các nguyên liệu bạn có và gợi ý những món ăn phù hợp nhất với khẩu vị của bạn.
        </Text>

        <View style={styles.actions}>
          <Button 
            title="TÌM THEO NGUYÊN LIỆU" 
            onPress={() => navigation.navigate('FridgeTab')}
            style={styles.actionBtn}
            icon={<Feather name="archive" size={20} color="#fff" />}
          />
          <Button 
            title="KHÁM PHÁ CÔNG THỨC" 
            variant="outline"
            onPress={() => navigation.navigate('HomeTab')}
            style={styles.actionBtn}
            icon={<Feather name="compass" size={20} color={COLORS.primary} />}
          />
        </View>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Feather name="check-circle" size={18} color={COLORS.primary} />
            <Text style={styles.featureText}>Tự động tính toán định lượng</Text>
          </View>
          <View style={styles.featureItem}>
            <Feather name="check-circle" size={18} color={COLORS.primary} />
            <Text style={styles.featureText}>Cá nhân hóa theo sở thích & dị ứng</Text>
          </View>
          <View style={styles.featureItem}>
            <Feather name="check-circle" size={18} color={COLORS.primary} />
            <Text style={styles.featureText}>Chế độ nấu ăn rảnh tay thông minh</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 16,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  actions: {
    width: '100%',
    gap: 16,
    marginBottom: 48,
  },
  actionBtn: {
    width: '100%',
  },
  featureList: {
    width: '100%',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
  }
});
