import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../constants/Theme';
import { useFridgeStore } from '../store/useFridgeStore';

export default function FridgeScreen({ navigation }) {
  const { myIngredients, ingredientCategories, addIngredient, removeIngredient } = useFridgeStore();
  const [search, setSearch] = useState('');

  // categories base
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return ingredientCategories;
    return ingredientCategories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.toLowerCase().includes(search.toLowerCase())
      ),
    })).filter(cat => cat.items.length > 0);
  }, [search, ingredientCategories]);

  // count how many recipes can be made (just simulate)
  const recipeEstimate = useMemo(() => {
    if (myIngredients.length === 0) return 0;
    if (myIngredients.length <= 2) return 1;
    if (myIngredients.length <= 4) return 3;
    return Math.min(myIngredients.length * 2, 15);
  }, [myIngredients]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Tủ lạnh của bạn" />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* how many ingredients */}
        <LinearGradient
          colors={myIngredients.length > 0 ? ['#ECFDF5', '#D1FAE5'] : ['#F3F4F6', '#E5E7EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.infoBanner}
        >
          <View style={styles.infoBannerContent}>
            <View style={styles.infoBannerLeft}>
              <View style={styles.infoIconCircle}>
                <Text style={styles.infoIconEmoji}>
                  {myIngredients.length > 0 ? <Feather name={"check-circle"} size={24} color={COLORS.primary} /> : <Feather name={"box"} size={24} color={COLORS.primary} />}
                </Text>
              </View>
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoTitle}>
                  {myIngredients.length > 0 
                    ? `${myIngredients.length} nguyên liệu có sẵn`
                    : 'Tủ lạnh trống'
                  }
                </Text>
                <Text style={styles.infoSubtitle}>
                  {myIngredients.length > 0 
                    ? `Có thể nấu khoảng ${recipeEstimate} món!`
                    : 'Thêm nguyên liệu để chúng tôi gợi ý món ăn cho bạn'
                  }
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* select ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đã chọn ({myIngredients.length})</Text>
            {myIngredients.length > 0 && (
              <TouchableOpacity onPress={() => useFridgeStore.getState().clearFridge()}>
                <Text style={styles.clearAll}>Xóa hết</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.chipContainer}>
            {myIngredients.map(item => (
              <TouchableOpacity 
                key={item} 
                style={styles.chipActive}
                onPress={() => removeIngredient(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipTextActive}>{item}</Text>
                <View style={styles.chipRemoveIcon}>
                  <Feather name="x" size={12} color={COLORS.primary} />
                </View>
              </TouchableOpacity>
            ))}
            {myIngredients.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🥢</Text>
                <Text style={styles.emptyTitle}>Chưa có nguyên liệu nào</Text>
                <Text style={styles.emptySubtitle}>Chọn nguyên liệu bên dưới để bắt đầu!</Text>
              </View>
            )}
          </View>
        </View>

        {/* search */}
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            placeholder="Tìm nhanh nguyên liệu..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={COLORS.textLight}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* group ingredients */}
        {filteredCategories.map(category => (
          <View key={category.id} style={styles.categoryGroup}>
            <Text style={styles.categoryLabel}>{category.label}</Text>
            <View style={styles.chipContainer}>
              {category.items.map(item => {
                const isActive = myIngredients.includes(item);
                return (
                  <TouchableOpacity 
                    key={item} 
                    style={[styles.chip, isActive && styles.chipSelectedInGroup]}
                    onPress={() => isActive ? removeIngredient(item) : addIngredient(item)}
                    activeOpacity={0.7}
                  >
                    {isActive ? (
                      <Feather name="check" size={14} color={COLORS.primary} />
                    ) : (
                      <Feather name="plus" size={14} color={COLORS.textMuted} />
                    )}
                    <Text style={[styles.chipText, isActive && styles.chipTextSelectedInGroup]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* space for footer btn*/}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* footer btn */}
      <View style={styles.footer}>
        <Button 
          title={`Gợi ý món ăn (${myIngredients.length} nguyên liệu)`}
          disabled={myIngredients.length === 0}
          onPress={() => navigation.navigate('SearchResult', { ingredients: myIngredients })}
          icon={<Feather name="book-open" size={20} color="#fff" />}
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
  content: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  // Info Banner
  infoBanner: {
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  infoBannerContent: {
    padding: 16,
  },
  infoBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  infoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconEmoji: {
    fontSize: 24,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoTitle: {
    ...TYPOGRAPHY.h3,
    color: '#065F46',
    marginBottom: 2,
  },
  infoSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: '#047857',
    fontSize: 13,
  },
  // Section
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  clearAll: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
  },
  // Chips
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  chipSelectedInGroup: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  chipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
    gap: 8,
  },
  chipRemoveIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
  },
  chipTextActive: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '700',
  },
  chipTextSelectedInGroup: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  // Empty State
  emptyState: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
    fontSize: 13,
  },
  // Search
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: BORDER_RADIUS.md,
    gap: 10,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
  },
  // Category Groups
  categoryGroup: {
    marginBottom: SPACING.lg,
  },
  categoryLabel: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: 12,
    fontSize: 15,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
});
