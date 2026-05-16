import { create } from 'zustand';

const INGREDIENT_CATEGORIES = [
  {
    id: 'meat',
    label: 'Thịt & Hải sản',
    icon: 'meat',
    items: ['Ức gà', 'Thịt bò nạm', 'Thịt ba chỉ xông khói', 'Cánh gà', 'Thịt bò phi lê', 'Xương ống bò', 'Tôm tươi', 'Thịt heo xay'],
  },
  {
    id: 'vegetable',
    label: 'Rau củ quả',
    icon: 'leaf',
    items: ['Hành lá', 'Cà chua', 'Cà rốt', 'Hành tây', 'Ớt chuông', 'Nấm hương', 'Xà lách', 'Cà chua bi', 'Khoai tây', 'Bông cải xanh', 'Dưa leo'],
  },
  {
    id: 'seasoning',
    label: 'Gia vị',
    icon: 'droplet',
    items: ['Tỏi', 'Gừng', 'Sả', 'Hạt tiêu', 'Muối', 'Dầu hào', 'Xì dầu', 'Sốt mè rang', 'Nước cốt dừa', 'Gia vị bò kho', 'Nước mắm', 'Đường', 'Hạt nêm', 'Quế', 'Hồi', 'Thảo quả'],
  },
  {
    id: 'other',
    label: 'Khác',
    icon: 'package',
    items: ['Trứng gà', 'Mì Spaghetti', 'Phô mai Parmesan', 'Bơ nhạt', 'Bánh phở', 'Bánh mì', 'Gạo thơm', 'Sữa tươi'],
  },
];

// Flatten for backward compatibility
const ALL_INGREDIENTS = INGREDIENT_CATEGORIES.flatMap(cat => cat.items);

export const useFridgeStore = create((set, get) => ({
  myIngredients: ['Trứng gà', 'Hành lá', 'Cà chua'], 
  selectedSearchIngredients: [],
  availableIngredients: ALL_INGREDIENTS,
  ingredientCategories: INGREDIENT_CATEGORIES,

  getGroupedIngredients: () => INGREDIENT_CATEGORIES,
  
  toggleSearchIngredient: (name) => {
    const current = get().selectedSearchIngredients;
    if (current.includes(name)) {
      set({ selectedSearchIngredients: current.filter(i => i !== name) });
    } else {
      set({ selectedSearchIngredients: [...current, name] });
    }
  },

  clearSearchIngredients: () => set({ selectedSearchIngredients: [] }),
  
  addIngredient: (name) => {
    const current = get().myIngredients;
    if (!current.includes(name)) {
      set({ myIngredients: [...current, name] });
    }
  },
  
  removeIngredient: (name) => {
    set({ myIngredients: get().myIngredients.filter(i => i !== name) });
  },

  clearFridge: () => set({ myIngredients: [] }),
}));

