import { create } from 'zustand';

const MOCK_RECIPES = [
  {
    id: '1',
    title: 'Salad Ức Gà Sốt Mè Rang',
    author: 'CookAI',
    time: '15p',
    rating: '4.9',
    difficulty: 'Dễ',
    calories: '350 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800',
    category: 'Healthy',
    ingredients: [
      { id: 'i1', name: 'Ức gà', amount: 200, unit: 'g' },
      { id: 'i2', name: 'Xà lách', amount: 100, unit: 'g' },
      { id: 'i3', name: 'Cà chua bi', amount: 50, unit: 'g' },
      { id: 'i4', name: 'Sốt mè rang', amount: 30, unit: 'ml' },
    ],
    steps: [
      { id: 's1', desc: 'Rửa sạch xà lách và cà chua bi, để ráo nước.', timer: 0 },
      { id: 's2', desc: 'Áp chảo ức gà với một ít muối và tiêu trong 10 phút.', timer: 600 },
      { id: 's3', desc: 'Thái ức gà thành miếng vừa ăn.', timer: 0 },
      { id: 's4', desc: 'Trộn tất cả nguyên liệu với sốt mè rang và thưởng thức.', timer: 0 },
    ],
    isTrending: true,
    matchScore: 0.98,
  },
  {
    id: '2',
    title: 'Pasta Carbonara Ý',
    author: 'Chef Maria',
    time: '20p',
    rating: '4.8',
    difficulty: 'Trung bình',
    calories: '600 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=400',
    category: 'Món Âu',
    ingredients: [
      { id: 'i5', name: 'Mì Spaghetti', amount: 100, unit: 'g' },
      { id: 'i6', name: 'Trứng gà', amount: 2, unit: 'quả' },
      { id: 'i7', name: 'Thịt ba chỉ xông khói', amount: 50, unit: 'g' },
      { id: 'i8', name: 'Phô mai Parmesan', amount: 30, unit: 'g' },
    ],
    steps: [
      { id: 's1', desc: 'Luộc mì spaghetti trong nước sôi 8-10 phút.', timer: 540 },
      { id: 's2', desc: 'Chiên thịt ba chỉ xông khói cho đến khi giòn.', timer: 300 },
      { id: 's3', desc: 'Đánh tan trứng với phô mai Parmesan.', timer: 0 },
      { id: 's4', desc: 'Trộn mì nóng với hỗn hợp trứng và thịt.', timer: 0 },
    ],
    isTrending: true,
  },
  {
    id: '3',
    title: 'Bò Kho Bánh Mì',
    author: 'Bếp Mẹ',
    time: '120p',
    rating: '5.0',
    difficulty: 'Khó',
    calories: '750 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41ba?q=80&w=400',
    category: 'Món Việt',
    ingredients: [
      { id: 'i9', name: 'Thịt bò nạm', amount: 500, unit: 'g' },
      { id: 'i10', name: 'Cà rốt', amount: 2, unit: 'củ' },
      { id: 'i11', name: 'Sả', amount: 3, unit: 'nhánh' },
      { id: 'i12', name: 'Gia vị bò kho', amount: 1, unit: 'gói' },
    ],
    steps: [
      { id: 's1', desc: 'Ướp thịt bò với gia vị trong 30 phút.', timer: 1800 },
      { id: 's2', desc: 'Xào săn thịt bò với sả và tỏi.', timer: 300 },
      { id: 's3', desc: 'Hầm thịt bò với nước dừa trong 90 phút.', timer: 5400 },
      { id: 's4', desc: 'Cho cà rốt vào hầm thêm 15 phút.', timer: 900 },
    ],
    isTopRated: true,
  }
];

export const useRecipeStore = create((set, get) => ({
  recipes: MOCK_RECIPES,
  categories: ['Tất cả', 'Healthy', 'Món Âu', 'Món Việt', 'Món Á', 'Đồ chay', 'Khai vị'],
  
  getRecipeById: (id) => get().recipes.find(r => r.id === id),
  
  getTrendingRecipes: () => get().recipes.filter(r => r.isTrending),
  
  getTopRatedRecipes: () => get().recipes.filter(r => r.isTopRated),

  searchRecipesByIngredients: (selectedIngredients) => {
    if (!selectedIngredients || selectedIngredients.length === 0) return [];
    
    return get().recipes.map(recipe => {
      const matchCount = recipe.ingredients.filter(ing => 
        selectedIngredients.some(selected => selected.toLowerCase() === ing.name.toLowerCase())
      ).length;
      
      const score = matchCount / recipe.ingredients.length;
      return { ...recipe, matchScore: score };
    })
    .filter(r => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
  },

  searchRecipesByName: (query) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return get().recipes.filter(r => r.title.toLowerCase().includes(lowerQuery));
  }
}));
