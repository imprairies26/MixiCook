import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/Theme';
import { useRecipeStore } from '../store/useRecipeStore';
import Button from '../components/common/Button';

const { width } = Dimensions.get('window');

const Timer = ({ initialSeconds }) => {
  const [timeLeft, setTimeSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.timerContainer}>
      <TouchableOpacity 
        style={[styles.timerCircle, isActive && { borderColor: COLORS.primary }]} 
        onPress={() => setIsActive(!isActive)}
      >
        <Feather name={isActive ? "pause" : "play"} size={24} color={COLORS.primary} />
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.timerLabel}>{isActive ? "Đang chạy" : "Bắt đầu"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setTimeSeconds(initialSeconds); setIsActive(false); }}>
        <Text style={styles.resetText}>Đặt lại</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function CookingModeScreen({ route, navigation }) {
  const { recipeId } = route.params || { recipeId: '1' };
  const { getRecipeById } = useRecipeStore();
  const recipe = getRecipeById(recipeId);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const scrollRef = useRef(null);

  if (!recipe) return null;

  const handleNext = () => {
    if (currentStep < recipe.steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      scrollRef.current?.scrollTo({ x: prev * width, animated: true });
    }
  };

  const onScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slide !== currentStep) {
      setCurrentStep(slide);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{recipe.title}</Text>
          <Text style={styles.headerSubtitle}>Bước {currentStep + 1} / {recipe.steps.length}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="settings" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((currentStep + 1) / recipe.steps.length) * 100}%` }]} />
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
      >
        {recipe.steps.map((step, index) => (
          <View key={step.id} style={styles.slide}>
            <View style={styles.card}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>BƯỚC {index + 1}</Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardContent}>
                <Text style={styles.stepDesc}>{step.desc}</Text>
                {step.timer > 0 && <Timer initialSeconds={step.timer} />}
              </ScrollView>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Navigation Controls */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navBtn, currentStep === 0 && { opacity: 0.3 }]} 
          onPress={handlePrev}
          disabled={currentStep === 0}
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <Button 
          title={currentStep === recipe.steps.length - 1 ? "HOÀN THÀNH" : "BƯỚC TIẾP THEO"} 
          variant="primary"
          style={styles.nextBtn}
          onPress={handleNext}
          icon={<Feather name={currentStep === recipe.steps.length - 1 ? "check" : "chevron-right"} size={20} color="#fff" />}
        />
      </View>

      {/* Completion Modal */}
      <Modal visible={isFinished} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={[COLORS.primary, '#34d399']} style={styles.successIcon}>
              <Feather name="award" size={40} color="#fff" />
            </LinearGradient>
            <Text style={styles.modalTitle}>Tuyệt vời!</Text>
            <Text style={styles.modalSubtitle}>Bạn đã hoàn thành món {recipe.title}. Hãy chia sẻ thành quả nhé!</Text>
            
            <View style={styles.modalActions}>
              <Button title="Về Trang chủ" variant="outline" style={{ flex: 1 }} onPress={() => navigation.navigate('HomeTab')} />
              <Button title="Đánh giá" style={{ flex: 1 }} onPress={() => navigation.navigate('HomeTab')} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerInfo: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    fontSize: 16,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  slide: {
    width: width,
    paddingHorizontal: 20,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 100, // Footer space
  },
  stepBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  stepBadgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontSize: 12,
  },
  cardContent: {
    flexGrow: 1,
  },
  stepDesc: {
    ...TYPOGRAPHY.body,
    fontSize: 22,
    color: COLORS.text,
    lineHeight: 34,
    textAlign: 'left',
  },
  timerContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  timerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 6,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    ...TYPOGRAPHY.h1,
    fontSize: 40,
    color: COLORS.primary,
  },
  timerLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  resetText: {
    marginTop: 16,
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: COLORS.background,
  },
  navBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nextBtn: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 32,
    padding: 32,
    width: '100%',
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    ...TYPOGRAPHY.h1,
    fontSize: 28,
    marginBottom: 12,
  },
  modalSubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    color: COLORS.textMuted,
    marginBottom: 32,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  }
});
