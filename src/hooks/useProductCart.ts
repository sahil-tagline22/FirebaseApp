import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { persist, createJSONStorage } from 'zustand/middleware';

const mmkv = new MMKV();

type Product = {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: { rate: number; count: number };
  title: string;
  quantity?: number;
};

type CartStyle = {
  totalCartProduct: Product[];
  addToCart: (data: Product) => void;
  removeFromCart: (id: number) => void;
};

export const useProductCart = create<CartStyle>()(
  persist(
    (set) => ({
      totalCartProduct: [],
      addToCart: (data: Product) => {
        set((state) => ({
          totalCartProduct: [...state.totalCartProduct, { ...data, quantity: 1 }],
        }));
      },
      removeFromCart : (id: number) => {
        set((state) => ({
          totalCartProduct: state.totalCartProduct.filter(item => item.id !== id)
        }))
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => ({
        setItem: (name, value) => mmkv.set(name, value),
        getItem: name => mmkv.getString(name) || null,
        removeItem: name => mmkv.delete(name),
      })),
    },
  ),
);
