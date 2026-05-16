import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../constants/Theme';
import { useShoppingStore } from '../store/useShoppingStore';
import Header from '../components/common/Header';

// --- Item component ---
function ShoppingItem({ item, onToggle, onRemove }) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onToggle(item.id);
  };

  return (
    <Animated.View style={[styles.itemCard, { transform: [{ scale }] }, item.checked && styles.itemCardChecked]}>
      <TouchableOpacity style={styles.checkBtn} onPress={handleToggle} activeOpacity={0.7}>
        <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
          {item.checked && <Feather name="check" size={12} color="#fff" />}
        </View>
      </TouchableOpacity>

      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
          {item.name}
        </Text>
        <View style={styles.itemMeta}>
          {item.amount ? (
            <Text style={styles.itemAmount}>
              {item.amount} {item.unit}
            </Text>
          ) : null}
          {item.sourceRecipe ? (
            <View style={styles.sourceTag}>
              <Feather name="book-open" size={10} color={COLORS.primary} />
              <Text style={styles.sourceText}>{item.sourceRecipe}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(item.id)}>
        <Feather name="x" size={16} color={COLORS.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// --- Main Screen ---
export default function ShoppingCartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { shoppingList, addItem, toggleCheck, removeItem, clearChecked, clearList } = useShoppingStore();
  const [newItemName, setNewItemName] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  const unchecked = shoppingList.filter(i => !i.checked);
  const checked = shoppingList.filter(i => i.checked);
  const progress = shoppingList.length > 0 ? checked.length / shoppingList.length : 0;

  const handleAddManual = () => {
    const name = newItemName.trim();
    if (!name) return;
    addItem({ name, amount: null, unit: null, sourceRecipe: null });
    setNewItemName('');
    setShowAddInput(false);
  };

  const handleClearChecked = () => {
    if (checked.length === 0) return;
    Alert.alert(
      'Xoá đã mua',
      `Xoá ${checked.length} mục đã tick khỏi danh sách?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Xoá', style: 'destructive', onPress: clearChecked },
      ]
    );
  };

  const handleClearAll = () => {
    if (shoppingList.length === 0) return;
    Alert.alert(
      'Xoá tất cả',
      'Bạn muốn xoá toàn bộ giỏ đi chợ?',
      [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Xoá hết', style: 'destructive', onPress: clearList },
      ]
    );
  };

  // Flatten: unchecked first, then checked
  const sections = [
    ...unchecked,
    ...(checked.length > 0 ? [{ _divider: true, id: '__divider__' }] : []),
    ...checked,
  ];

  const renderItem = ({ item }) => {
    if (item._divider) {
      return (
        <View style={styles.dividerRow}>
          <Text style={styles.dividerText}>✓ Đã mua ({checked.length})</Text>
          <TouchableOpacity onPress={handleClearChecked}>
            <Text style={styles.clearCheckedText}>Xoá</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <ShoppingItem
        item={item}
        onToggle={toggleCheck}
        onRemove={removeItem}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Giỏ đi chợ"
        showBack
        rightElement={
          <TouchableOpacity onPress={handleClearAll} style={styles.headerBtn}>
            <Feather name="trash-2" size={20} color={COLORS.error} />
          </TouchableOpacity>
        }
      />

      {/* Progress bar */}
      {shoppingList.length > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Đã mua {checked.length}/{shoppingList.length} nguyên liệu
            </Text>
            <Text style={styles.progressPct}>{Math.round(progress * 100)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]}
            />
          </View>
          {progress === 1 && (
            <View style={styles.completeChip}>
              <Feather name="check-circle" size={14} color={COLORS.primary} />
              <Text style={styles.completeText}>Đã mua đủ nguyên liệu! 🎉</Text>
            </View>
          )}
        </View>
      )}

      {/* List */}
      {shoppingList.length === 0 ? (
        <View style={styles.emptyState}>
          <LinearGradient
            colors={[COLORS.primarySoft, 'transparent']}
            style={styles.emptyIcon}
          >
            <Feather name="shopping-cart" size={40} color={COLORS.primary} />
          </LinearGradient>
          <Text style={styles.emptyTitle}>Giỏ trống</Text>
          <Text style={styles.emptySubtitle}>
            Mở một công thức và bấm{'\n'}"Thêm vào giỏ" để bắt đầu nhé!
          </Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 110 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Footer: add + summary */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {showAddInput ? (
          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              placeholder="Tên nguyên liệu..."
              placeholderTextColor={COLORS.textMuted}
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleAddManual}
            />
            <TouchableOpacity style={styles.addConfirmBtn} onPress={handleAddManual}>
              <Feather name="check" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addCancelBtn}
              onPress={() => { setShowAddInput(false); setNewItemName(''); }}
            >
              <Feather name="x" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addItemBtn}
            onPress={() => setShowAddInput(true)}
          >
            <LinearGradient
              colors={[COLORS.primary, '#34d399']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addItemBtnGradient}
            >
              <Feather name="plus" size={20} color="#fff" />
              <Text style={styles.addItemBtnText}>Thêm nguyên liệu</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Progress
  progressSection: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  progressPct: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  completeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  completeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '700',
  },

  // List
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
    marginBottom: 10,
    ...SHADOWS.sm,
  },
  itemCardChecked: {
    opacity: 0.55,
  },
  checkBtn: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 15,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  itemAmount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '700',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 11,
  },
  removeBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  dividerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearCheckedText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontWeight: '700',
  },

  // Empty
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addItemBtn: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  addItemBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  addItemBtnText: {
    ...TYPOGRAPHY.h3,
    color: '#fff',
    fontSize: 16,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontSize: 15,
  },
  addConfirmBtn: {
    width: 46,
    height: 46,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCancelBtn: {
    width: 46,
    height: 46,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
