import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../constants/Theme';
import { useFridgeStore } from '../store/useFridgeStore';

export default function IngredientPickerScreen({ navigation }) {
  const { ingredientCategories, selectedSearchIngredients, toggleSearchIngredient } = useFridgeStore();
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return ingredientCategories;
    return ingredientCategories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.toLowerCase().includes(search.toLowerCase())
      ),
    })).filter(cat => cat.items.length > 0);
  }, [search, ingredientCategories]);

  const totalFiltered = useMemo(() => {
    return filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  }, [filteredCategories]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Chọn nguyên liệu" showBack />
      
      {/* Search + Selection Info merged */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            placeholder="Tìm nguyên liệu..."
            style={styles.input}
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

        {/* Selection Info Bar */}
        <View style={styles.selectionInfo}>
          <View style={styles.selectionLeft}>
            <View style={styles.selectionBadge}>
              <Text style={styles.selectionBadgeText}>{selectedSearchIngredients.length}</Text>
            </View>
            <Text style={styles.selectionText}>nguyên liệu đã chọn</Text>
          </View>
          {selectedSearchIngredients.length > 0 && (
            <TouchableOpacity onPress={() => useFridgeStore.getState().clearSearchIngredients()}>
              <Text style={styles.clearAll}>Xóa hết</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Selected chips preview */}
        {selectedSearchIngredients.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.selectedChipsScroll}
          >
            {selectedSearchIngredients.map(item => (
              <TouchableOpacity 
                key={item}
                style={styles.selectedChip}
                onPress={() => toggleSearchIngredient(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.selectedChipText}>{item}</Text>
                <Feather name="x" size={12} color={COLORS.primary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Grouped ingredient list */}
        {filteredCategories.map(category => (
          <View key={category.id} style={styles.categoryGroup}>
            <Text style={styles.categoryLabel}>{category.label}</Text>
            <View style={styles.list}>
              {category.items.map((item) => {
                const isSelected = selectedSearchIngredients.includes(item);
                return (
                  <TouchableOpacity 
                    key={item} 
                    style={[styles.item, isSelected && styles.itemSelected]}
                    onPress={() => toggleSearchIngredient(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemLeft}>
                      <View style={[styles.itemIcon, isSelected && styles.itemIconSelected]}>
                        <Feather 
                          name={isSelected ? "check" : "plus"} 
                          size={16} 
                          color={isSelected ? '#fff' : COLORS.textMuted} 
                        />
                      </View>
                      <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>{item}</Text>
                    </View>
                    <Feather 
                      name={isSelected ? "check-circle" : "circle"} 
                      size={20} 
                      color={isSelected ? COLORS.primary : COLORS.border} 
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* No results */}
        {totalFiltered === 0 && search.length > 0 && (
          <View style={styles.noResult}>
            <Text style={styles.noResultEmoji}>🔍</Text>
            <Text style={styles.noResultText}>Không tìm thấy "{search}"</Text>
            <Text style={styles.noResultSub}>Thử từ khóa khác nhé!</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) + 16 }]}>
        <Button 
          title={`XÁC NHẬN (${selectedSearchIngredients.length})`} 
          onPress={() => navigation.goBack()}
          disabled={selectedSearchIngredients.length === 0}
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
  // Search Section
  searchSection: {
    backgroundColor: COLORS.surface,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: BORDER_RADIUS.md,
    gap: 10,
    marginHorizontal: 16,
    marginTop: 4,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
  },
  // Selection Info
  selectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionBadgeText: {
    ...TYPOGRAPHY.caption,
    color: '#fff',
    fontSize: 11,
  },
  selectionText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
  },
  clearAll: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
  },
  // Selected chips preview
  selectedChipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.xl,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
  },
  selectedChipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontSize: 12,
  },
  // Scroll Content
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  // Category Groups
  categoryGroup: {
    marginBottom: SPACING.lg,
  },
  categoryLabel: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: 10,
    fontSize: 15,
  },
  list: {
    gap: 8,
  },
  // Items
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIconSelected: {
    backgroundColor: COLORS.primary,
  },
  itemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontSize: 15,
  },
  itemTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  // No Results
  noResult: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  noResultText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  noResultSub: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.md,
  },
});
