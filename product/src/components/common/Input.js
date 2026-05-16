import { useRef, useCallback, forwardRef } from 'react';
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../../constants/Theme';

/**
 * Input component với animated focus effect.
 *
 * LÝ DO DÙNG Animated.Value THAY VÌ useState:
 * - useState(isFocused) khi thay đổi sẽ trigger re-render toàn bộ component cây.
 * - React Native sau đó reconcile lại các TextInput native views.
 * - Điều này gây hiện tượng focus tự nhảy giữa các ô input (đặc biệt
 *   với secureTextEntry vì iOS/Android dùng native view khác nhau).
 * - Animated.Value chạy trên native thread, không gây React re-render → fix bug.
 */
const Input = forwardRef(function Input(
  {
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    icon,
    rightIcon,
    onRightIconPress,
    style,
    inputStyle,
    onFocus,
    onBlur,
    ...props
  },
  ref
) {
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(
    (e) => {
      Animated.timing(focusAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: false,
      }).start();
      onFocus?.(e);
    },
    [focusAnim, onFocus]
  );

  const handleBlur = useCallback(
    (e) => {
      Animated.timing(focusAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
      onBlur?.(e);
    },
    [focusAnim, onBlur]
  );

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', COLORS.primary],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F3F4F6', COLORS.surface ?? '#FFFFFF'],
  });

  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.1],
  });

  const elevation = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          borderColor,
          backgroundColor,
          elevation,
          shadowOpacity,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 10,
        },
      ]}
    >
      {icon && (
        <Feather
          name={icon}
          size={20}
          color={COLORS.textMuted}
          style={styles.leftIcon}
        />
      )}
      <TextInput
        ref={ref}
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
          <Feather name={rightIcon} size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
});

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  leftIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    height: '100%',
  },
  rightIcon: {
    marginLeft: 12,
  },
});
