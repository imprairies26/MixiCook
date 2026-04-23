import { create } from 'zustand';

export const useShoppingStore = create((set, get) => ({
  shoppingList: [],
  
  addItem: (item) => {
    const current = get().shoppingList;
    const exists = current.find(i => i.name === item.name);
    if (exists) {
      set({
        shoppingList: current.map(i => 
          i.name === item.name ? { ...i, amount: i.amount + (item.amount || 0) } : i
        )
      });
    } else {
      set({ shoppingList: [...current, { ...item, id: Date.now().toString(), checked: false }] });
    }
  },
  
  toggleCheck: (id) => {
    set({
      shoppingList: get().shoppingList.map(i => 
        i.id === id ? { ...i, checked: !i.checked } : i
      )
    });
  },
  
  removeItem: (id) => {
    set({ shoppingList: get().shoppingList.filter(i => i.id !== id) });
  },

  clearList: () => set({ shoppingList: [] }),
}));
