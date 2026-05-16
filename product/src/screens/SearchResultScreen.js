import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Header from '../components/common/Header';
import RecipeCard from '../components/common/RecipeCard';
import Button from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/Theme';
import { useRecipeStore } from '../store/useRecipeStore';

export default function SearchResultScreen({ route, navigation }) {
  const { query, ingredients } = route.params || {};
  const { recipes, searchRecipesByIngredients } = useRecipeStore();

  const results = useMemo(() => {
    if (ingredients && ingredients.length > 0) {
      return searchRecipesByIngredients(ingredients);
    }
    if (query) {
      return recipes.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    return recipes;
  }, [query, ingredients, recipes, searchRecipesByIngredients]);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={ingredients ? "Dự đoán món ăn" : `Kết quả cho "${query === "" ? "thịnh hành" : query}"`} 
        showBack 
      />

      <View style={styles.infoSection}>
        {ingredients ? (
          <View style={styles.aiBadge}>
            <Feather name="cpu" size={14} color="#fff" />
            <Text style={styles.aiBadgeText}>AI Prediction Powered</Text>
          </View>
        ) : (
          <Text style={styles.resultCount}>{results.length} món ăn được tìm thấy</Text>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {results.length > 0 ? (
          <View style={styles.grid}>
            {results.map(item => (
              <RecipeCard 
                key={item.id}
                title={item.title}
                author={item.author}
                time={item.time}
                rating={item.rating}
                matchScore={item.matchScore}
                imageUrl={item.imageUrl}
                style={styles.gridItem}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="search" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>Không tìm thấy món ăn nào</Text>
            <Text style={styles.emptySubtitle}>Hãy thử chọn thêm nguyên liệu hoặc tìm từ khóa khác nhé!</Text>
            
            <View style={styles.emptyActions}>
              {ingredients ? (
                <Button 
                  title="Đổi nguyên liệu" 
                  onPress={() => navigation.navigate('FridgeTab')}
                  style={styles.emptyBtn}
                  icon={<Feather name="edit-2" size={18} color="#fff" />}
                />
              ) : null}
              <Button 
                title="Xem tất cả công thức" 
                variant={ingredients ? "outline" : "primary"}
                onPress={() => navigation.navigate('HomeTab')}
                style={styles.emptyBtn}
              />
            </View>
          </View>
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
  infoSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  aiBadgeText: {
    ...TYPOGRAPHY.caption,
    color: '#fff',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  resultCount: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 30,
    marginBottom: 32,
  },
  emptyActions: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyBtn: {
    width: '100%',
  }
});
