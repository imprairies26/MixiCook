import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/Theme';
import { useRecipeStore } from '../store/useRecipeStore';
import { useFridgeStore } from '../store/useFridgeStore';
import { useShoppingStore } from '../store/useShoppingStore';

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipeId } = route.params || { recipeId: '1' };
  const { getRecipeById } = useRecipeStore();
  const { myIngredients } = useFridgeStore();
  const { addItem, shoppingList } = useShoppingStore();

  const recipe = getRecipeById(recipeId);
  const [servings, setServings] = useState(2);

  const scaledIngredients = useMemo(() => {
    if (!recipe) return [];
    const ratio = servings / 2; // Assume base recipe is for 2 people
    return recipe.ingredients.map(ing => ({
      ...ing,
      scaledAmount: Number((ing.amount * ratio).toFixed(1))
    }));
  }, [recipe, servings]);

  const missingIngredients = useMemo(() => {
    return scaledIngredients.filter(ing => 
      !myIngredients.some(mine => mine.toLowerCase() === ing.name.toLowerCase())
    );
  }, [scaledIngredients, myIngredients]);

  if (!recipe) return null;

  const handleAddAllMissing = () => {
    if (missingIngredients.length === 0) return;
    missingIngredients.forEach(ing => {
      addItem({ name: ing.name, amount: ing.scaledAmount, unit: ing.unit, sourceRecipe: recipe.title });
    });
    Alert.alert(
      'Đã thêm vào giỏ',
      `${missingIngredients.length} nguyên liệu còn thiếu đã được thêm vào giỏ đi chợ!`,
      [
        { text: 'Tiếp tục', style: 'cancel' },
        { text: 'Xem giỏ hàng', onPress: () => navigation.navigate('ShoppingCart') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" transparent />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.heroSection}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} transition={300} />
          <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent']} style={styles.topGradient} />
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <Feather name="chevron-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Feather name="heart" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.indicator} />
          
          <Text style={styles.category}>{recipe.category}</Text>
          <Text style={styles.title}>{recipe.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={16} color={COLORS.primary} />
              <Text style={styles.metaText}>{recipe.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="bar-chart" size={16} color={COLORS.primary} />
              <Text style={styles.metaText}>{recipe.difficulty}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="zap" size={16} color={COLORS.primary} />
              <Text style={styles.metaText}>{recipe.calories}</Text>
            </View>
          </View>

          {/* Servings Control */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nguyên liệu</Text>
            <View style={styles.portionControl}>
              <TouchableOpacity 
                onPress={() => setServings(Math.max(1, servings - 1))}
                style={styles.qtyBtn}
              >
                <Feather name="minus" size={14} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{servings} người</Text>
              <TouchableOpacity 
                onPress={() => setServings(servings + 1)}
                style={styles.qtyBtn}
              >
                <Feather name="plus" size={14} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          {missingIngredients.length > 0 && (
            <TouchableOpacity style={styles.shoppingAlert} onPress={handleAddAllMissing}>
              <Feather name="shopping-cart" size={16} color={COLORS.accent} />
              <Text style={styles.shoppingAlertText}>
                Bạn thiếu {missingIngredients.length} nguyên liệu. Bấm để thêm vào giỏ!
              </Text>
            </TouchableOpacity>
          )}

          {scaledIngredients.map((ing) => {
            const isMissing = !myIngredients.some(mine => mine.toLowerCase() === ing.name.toLowerCase());
            const isInCart = shoppingList.some(item => item.name.toLowerCase() === ing.name.toLowerCase());
            return (
              <View key={ing.id} style={styles.ingredientRow}>
                <View style={[styles.bullet, isMissing && { backgroundColor: COLORS.accent }]} />
                <Text style={[styles.ingredientName, isMissing && { color: COLORS.accent }]}>
                  {ing.name}
                </Text>
                <Text style={styles.ingredientAmount}>
                  {ing.scaledAmount} {ing.unit}
                </Text>
                {isInCart ? (
                  <Feather name="check-circle" size={18} color={COLORS.primary} />
                ) : (
                  <TouchableOpacity onPress={() => addItem({ name: ing.name, amount: ing.scaledAmount, unit: ing.unit, sourceRecipe: recipe.title })}>
                    <Feather name="plus-circle" size={18} color={COLORS.border} />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Các bước nấu ({recipe.steps.length})</Text>
          {recipe.steps.map((step, idx) => (
            <View key={step.id} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumText}>{idx + 1}</Text>
              </View>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button 
          title="BẮT ĐẦU NẤU" 
          variant="primary"
          onPress={() => navigation.navigate('CookingMode', { recipeId: recipe.id, servings })}
          icon={<Feather name="play" size={20} color="#fff" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroSection: {
    height: 380,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  headerButtons: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    backgroundColor: COLORS.background,
    marginTop: -30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  category: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    fontSize: 26,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 20,
    color: COLORS.text,
  },
  portionControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    ...TYPOGRAPHY.caption,
    paddingHorizontal: 12,
    color: COLORS.text,
  },
  shoppingAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
  },
  shoppingAlertText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.accent,
    fontWeight: '700',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 12,
  },
  ingredientName: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  ingredientAmount: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    marginRight: 12,
    color: COLORS.text,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  stepDesc: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    lineHeight: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 34,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  }
});
