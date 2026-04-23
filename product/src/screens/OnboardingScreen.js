import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/Theme';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/common/Button';

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuthStore();
  const [selectedTastes, setSelectedTastes] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  const tasteOptions = ['Ăn chay', 'Thích ăn cay', 'Đồ ngọt', 'Món Âu', 'Món Việt', 'Healthy', 'Ít béo'];
  const allergyOptions = ['Hải sản', 'Đậu phộng', 'Sữa', 'Gluten', 'Nhộng tằm', 'Trứng'];

  const toggleSelection = (item, type) => {
    if (type === 'taste') {
      setSelectedTastes(prev => 
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    } else {
      setSelectedAllergies(prev => 
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '80%' }]} />
          </View>
        </View>
        <Text style={styles.headerLabel}>THIẾT LẬP CÁ NHÂN</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.title}>Khẩu vị của bạn?</Text>
          <Text style={styles.subtitle}>Chọn sở thích để AI đề xuất món ăn phù hợp nhất với bạn.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sở thích ăn uống</Text>
          <View style={styles.chipContainer}>
            {tasteOptions.map((item) => (
              <TouchableOpacity 
                key={item} 
                activeOpacity={0.8}
                onPress={() => toggleSelection(item, 'taste')}
                style={[styles.chip, selectedTastes.includes(item) && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedTastes.includes(item) && styles.chipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.sectionTitle}>Chế độ kiêng / Dị ứng</Text>
            <Feather name="info" size={14} color={COLORS.textMuted} />
          </View>
          <View style={styles.chipContainer}>
            {allergyOptions.map((item) => (
              <TouchableOpacity 
                key={item} 
                activeOpacity={0.8}
                onPress={() => toggleSelection(item, 'allergy')}
                style={[styles.chip, selectedAllergies.includes(item) && styles.chipActiveAllergy]}
              >
                <Text style={[styles.chipText, selectedAllergies.includes(item) && styles.chipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <LinearGradient
          colors={['rgba(16, 185, 129, 0.05)', 'rgba(255, 255, 255, 0)']}
          style={styles.aiBox}
        >
          <Feather name="cpu" size={24} color={COLORS.primary} style={{ marginBottom: 12 }} />
          <Text style={styles.aiTitle}>AI đã sẵn sàng!</Text>
          <Text style={styles.aiText}>Chúng tôi đã phân tích hơn 10.000 công thức dựa trên sở thích của bạn.</Text>
        </LinearGradient>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="XÁC NHẬN & BẮT ĐẦU" 
          onPress={completeOnboarding}
          icon={<Feather name="check" size={20} color="#fff" />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  headerLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  intro: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    ...TYPOGRAPHY.h1,
    fontSize: 32,
    color: COLORS.text,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: 12,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    color: COLORS.text,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipActiveAllergy: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  chipText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  aiBox: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
    marginTop: 20,
  },
  aiTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 8,
  },
  aiText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: COLORS.background,
  },
});
