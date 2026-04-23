export const COLORS = {
  primary: '#10B981',    
  primaryLight: 'rgba(16, 185, 129, 0.08)', 
  primarySoft: 'rgba(16, 185, 129, 0.15)',  
  secondary: '#334155',  
  accent: '#F59E0B',     
  warmAccent: '#FF6B35', 
  background: '#FAFAF9', 
  surface: '#FFFFFF',    
  text: '#1F2937',       
  textMuted: '#6B7280',  
  textLight: '#9CA3AF', 
  border: '#E5E7EB',    
  error: '#EF4444',
  success: '#10B981',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  glow: (color = '#10B981') => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  }),
};

export const TYPOGRAPHY = {
  h1: {
    fontFamily: 'Rubik-Bold',
    fontSize: 24,
    fontWeight: '700',
  },
  h2: {
    fontFamily: 'Rubik-Bold',
    fontSize: 20,
    fontWeight: '700',
  },
  h3: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16,
  },
  bodySmall: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 14,
  },
  caption: {
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
    fontWeight: '600',
  },
};
