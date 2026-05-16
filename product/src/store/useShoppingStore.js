import { create } from 'zustand';

export const useShoppingStore = create((set, get) => ({
  shoppingList: [],

  addItem: (item) => {
    const current = get().shoppingList;
    const exists = current.find(i => i.name.toLowerCase() === item.name.toLowerCase());
    if (exists) {
      set({
        shoppingList: current.map(i =>
          i.name.toLowerCase() === item.name.toLowerCase()
            ? { ...i, amount: Number(((i.amount || 0) + (item.amount || 0)).toFixed(1)) }
            : i
        ),
      });
    } else {
      set({
        shoppingList: [
          ...current,
          {
            ...item,
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            checked: false,
            addedAt: new Date().toISOString(),
          },
        ],
      });
    }
  },

  // Thêm nhiều nguyên liệu từ một công thức (kèm tên công thức để hiển thị)
  addItemsFromRecipe: (ingredients, recipeTitle) => {
    ingredients.forEach(ing => {
      get().addItem({ ...ing, sourceRecipe: recipeTitle });
    });
  },

  toggleCheck: (id) => {
    set({
      shoppingList: get().shoppingList.map(i =>
        i.id === id ? { ...i, checked: !i.checked } : i
      ),
    });
  },

  removeItem: (id) => {
    set({ shoppingList: get().shoppingList.filter(i => i.id !== id) });
  },

  clearChecked: () => {
    set({ shoppingList: get().shoppingList.filter(i => !i.checked) });
  },

  clearList: () => set({ shoppingList: [] }),

  getCheckedCount: () => get().shoppingList.filter(i => i.checked).length,

  getTotalCount: () => get().shoppingList.length,
}));
