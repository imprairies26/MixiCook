import { useEffect } from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY } from '../constants/Theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" transparent />
      <LinearGradient
        colors={[COLORS.primary, '#059669']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Feather name="coffee" size={48} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>MixiCook</Text>
        <Text style={styles.subtitle}>Mix the ingredients and cook</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    ...TYPOGRAPHY.h1,
    fontSize: 40,
    color: '#fff',
    fontWeight: '900',
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    letterSpacing: 4,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  }
});
