import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY } from '../../constants/Theme';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  style, 
  textStyle, 
  icon,
  disabled = false
}) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'outline': return styles.outline;
      case 'accent': return styles.accent;
      case 'ghost': return styles.ghost;
      case 'secondary': return styles.secondary;
      default: return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline': return styles.textOutline;
      case 'accent': return styles.textAccent;
      case 'ghost': return styles.textGhost;
      case 'secondary': return styles.textSecondary;
      default: return styles.textPrimary;
    }
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={onPress} 
        style={[style, disabled && { opacity: 0.6 }]}
        disabled={disabled}
      >
        <LinearGradient
          colors={[COLORS.primary, '#34d399']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, styles.primary]}
        >
          {icon}
          <Text style={[styles.text, styles.textPrimary, textStyle]}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress} 
      style={[styles.base, getVariantStyle(), style, disabled && { opacity: 0.6 }]}
      disabled={disabled}
    >
      {icon}
      <Text style={[styles.text, getTextStyle(), textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 10,
  },
  primary: {
    // Gradient handles background
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  accent: {
    backgroundColor: COLORS.accent,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  text: {
    ...TYPOGRAPHY.caption,
    fontSize: 16,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#FFFFFF',
  },
  textAccent: {
    color: '#FFFFFF',
  },
  textOutline: {
    color: COLORS.primary,
  },
  textGhost: {
    color: COLORS.text,
  },
});
