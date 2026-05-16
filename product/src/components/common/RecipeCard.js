import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY } from '../../constants/Theme';

export default function RecipeCard({
  title,
  author,
  time,
  rating,
  matchScore,
  imageUrl,
  onPress,
  onSave,
  style,
  large = false
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.container, large ? styles.largeContainer : styles.standardContainer, style]}
    >
      <Image
        source={{ uri: imageUrl || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400' }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />

      <View style={styles.topContainer}>
        <View style={styles.leftBadges}>
          {rating ? (
            <View style={styles.badge}>
              <Feather name="star" size={12} color={COLORS.accent} />
              <Text style={styles.badgeText}>{rating}</Text>
            </View>
          ) : null}
          {matchScore ? (
            <View style={[styles.badge, { backgroundColor: COLORS.primary }]}>
              <Text style={[styles.badgeText, { color: '#fff' }]}>{Math.round(matchScore * 100)}% Match</Text>
            </View>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={onSave ?? (() => Alert.alert('Đã lưu', `"${title}" đã được thêm vào danh sách yêu thích.`))}
        >
          <Feather name="bookmark" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, large && styles.largeTitle]} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.footer}>
          <View style={styles.metaItem}>
            <Feather name="user" size={12} color="#D1D5DB" />
            <Text style={styles.metaText} numberOfLines={1}>{author}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="clock" size={12} color="#D1D5DB" />
            <Text style={styles.metaText}>{time}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  standardContainer: {
    width: 160,
    height: 220,
  },
  largeContainer: {
    width: '100%',
    height: 260,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  leftBadges: {
    flexDirection: 'column',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    fontSize: 10,
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 6,
  },
  largeTitle: {
    fontSize: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...TYPOGRAPHY.bodySmall,
    color: '#D1D5DB',
    fontSize: 11,
  },
});
