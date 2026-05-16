import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Animated, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../constants/Theme';
import RecipeCard from '../components/common/RecipeCard';
import { useRecipeStore } from '../store/useRecipeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useShoppingStore } from '../store/useShoppingStore';

const CATEGORY_ICONS = {
  'Tất cả': 'grid',
  'Healthy': 'heart',
  'Món Âu': 'globe',
  'Món Việt': 'flag',
  'Món Á': 'sun',
  'Đồ chay': 'feather',
  'Khai vị': 'coffee',
};

export default function HomeScreen({ navigation }) {
  const { recipes, getTrendingRecipes, getTopRatedRecipes, categories, searchRecipesByName } = useRecipeStore();
  const { user } = useAuthStore();
  const { shoppingList } = useShoppingStore();
  const cartCount = shoppingList.filter(i => !i.checked).length;
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  // Memoize base lists
  const trending = useMemo(() => getTrendingRecipes(), [recipes]);
  const topRated = useMemo(() => getTopRatedRecipes(), [recipes]);
  const heroRecipe = trending[0];

  // Filter by active category
  const filteredTrending = useMemo(() => {
    if (activeCategory === 'Tất cả') return trending;
    return trending.filter(r => r.category === activeCategory);
  }, [trending, activeCategory]);

  const filteredTopRated = useMemo(() => {
    if (activeCategory === 'Tất cả') return topRated;
    return topRated.filter(r => r.category === activeCategory);
  }, [topRated, activeCategory]);

  // Memoize search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchRecipesByName(searchQuery);
  }, [searchQuery, recipes]);

  // animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const getTimeSuggestion = () => {
    const hour = new Date().getHours();
    if (hour < 10) return 'Bữa sáng nhẹ nhàng nào!';
    if (hour < 14) return 'Trưa nay ăn gì nhỉ?';
    if (hour < 18) return 'Bữa xế ăn gì?';
    return 'Bữa tối ấm cúng nhé!';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <LinearGradient
            colors={[COLORS.primary, '#34d399']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'M'}</Text>
          </LinearGradient>
          <View>
            <Text style={styles.greeting}>{getTimeGreeting()},</Text>
            <Text style={styles.userName}>{user?.name || 'Mixi Cook'}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('ShoppingCart')}
          >
            <Feather name="shopping-cart" size={22} color={COLORS.text} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 9 ? '9+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* search bar */}
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color={COLORS.textMuted} style={{marginRight: 12}} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm món ăn..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {searchQuery.length > 0 ? (
          <View style={[styles.section, { marginBottom: 140 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Kết quả tìm kiếm</Text>
            </View>
            <View style={styles.grid}>
              {searchResults.map(item => (
                <RecipeCard 
                  key={item.id}
                  title={item.title}
                  author={item.author}
                  time={item.time}
                  rating={item.rating}
                  imageUrl={item.imageUrl}
                  style={styles.gridItem}
                  onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
                />
              ))}
              {searchResults.length === 0 && (
                <Text style={{ ...TYPOGRAPHY.body, color: COLORS.textMuted, textAlign: 'center', width: '100%', marginTop: 20 }}>
                  Không tìm thấy món ăn nào.
                </Text>
              )}
            </View>
          </View>
        ) : (
          <>
        {/* time slide banner */}
        <Animated.View style={[styles.suggestionBanner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient
            colors={['#ECFDF5', '#D1FAE5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.suggestionGradient}
          >
            <Text style={styles.suggestionText}>{getTimeSuggestion()}</Text>
            <TouchableOpacity 
              style={styles.suggestionBtn}
              onPress={() => navigation.navigate('FridgeTab')}
            >
              <Text style={styles.suggestionBtnText}>Khám phá</Text>
              <Feather name="arrow-right" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Category Chips */}
        <View style={styles.categorySection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <TouchableOpacity 
                  key={cat}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => setActiveCategory(cat)}
                  activeOpacity={0.7}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={[COLORS.primary, '#34d399']}
                      style={styles.categoryChipGradient}
                    >
                      <Feather name={CATEGORY_ICONS[cat] || 'tag'} size={14} color="#fff" />
                      <Text style={styles.categoryTextActive}>{cat}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.categoryChipInner}>
                      <Feather name={CATEGORY_ICONS[cat] || 'tag'} size={14} color={COLORS.textMuted} />
                      <Text style={styles.categoryText}>{cat}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* sys suggest */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.aiIconWrapper}>
                <Feather name="zap" size={14} color="#fff" />
              </View>
              <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
            </View>
          </View>
          {heroRecipe && (
            <View>
              <RecipeCard 
                large
                title={heroRecipe.title}
                author={heroRecipe.author}
                time={heroRecipe.time}
                rating={heroRecipe.rating}
                matchScore={heroRecipe.matchScore}
                imageUrl={heroRecipe.imageUrl}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: heroRecipe.id })}
              />
              {heroRecipe.matchScore && (
                <View style={styles.matchBadge}>
                  <Feather name="check-circle" size={12} color={COLORS.primary} />
                  <Text style={styles.matchText}>
                    {Math.round(heroRecipe.matchScore * 100)}% phù hợp khẩu vị của bạn
                  </Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>

        {/* trending */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đang thịnh hành</Text>
            <TouchableOpacity
              style={styles.seeAllBtn}
              onPress={() => navigation.navigate('SearchResult', { query: '' })}
            >
              <Text style={styles.seeAll}>Xem tất cả</Text>
              <Feather name="chevron-right" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {filteredTrending.slice(1).map(item => (
              <RecipeCard 
                key={item.id}
                title={item.title}
                author={item.author}
                time={item.time}
                rating={item.rating}
                imageUrl={item.imageUrl}
                style={{marginRight: 16}}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
              />
            ))}
          </ScrollView>
        </View>

        {/* top rate */}
        <View style={[styles.section, { marginBottom: 140 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top đánh giá cao</Text>
          </View>
          <View style={styles.grid}>
            {filteredTopRated.map(item => (
              <RecipeCard 
                key={item.id}
                title={item.title}
                author={item.author}
                time={item.time}
                rating={item.rating}
                imageUrl={item.imageUrl}
                style={styles.gridItem}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
              />
            ))}
          </View>
        </View>
          </>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  greeting: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
  },
  userName: {
    ...TYPOGRAPHY.h3,
    fontSize: 17,
    color: COLORS.text,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  dot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  // Suggestion Banner
  suggestionBanner: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  suggestionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.lg,
  },
  suggestionText: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    color: '#065F46',
    fontWeight: '600',
  },
  suggestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  suggestionBtnText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontSize: 12,
  },
  // Category Chips
  categorySection: {
    marginBottom: SPACING.lg,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.lg,
    gap: 10,
  },
  categoryChip: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  categoryChipActive: {
    // gradient handles it
  },
  categoryChipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    borderRadius: BORDER_RADIUS.xl,
  },
  categoryChipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 13,
  },
  categoryTextActive: {
    ...TYPOGRAPHY.caption,
    color: '#fff',
    fontSize: 13,
  },
  // Sections
  section: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAll: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontSize: 13,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  matchText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  hScroll: {
    paddingRight: SPACING.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  gridItem: {
    width: '47%',
  },
  
});
