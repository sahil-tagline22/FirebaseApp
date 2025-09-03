import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage/zustendStorage';

type Product = {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: { rate: number; count: number };
  title: string;
  quantity?: number;
  newPrice? : number;
};

type CartStyle = {
  totalCartProduct: Product[];
  addToCart: (data: Product) => void;
  removeFromCart: (id: number) => void;
  increaseItemQuantity : (id:number,type : 'increment' | 'decrement') => void;
  clearCart : () => void;
};

export const useProductCart = create<CartStyle>()(
  persist(
    set => ({
      totalCartProduct: [],
      addToCart: (data: Product) => {
        set(state => ({
          totalCartProduct: [
            ...state.totalCartProduct,
            { ...data, quantity: 1, newPrice : data.price},
          ],
        }));
      },
      removeFromCart: (id: number) => {
        set(state => ({
          totalCartProduct: state.totalCartProduct.filter(
            item => item.id !== id,
          ),
        }));
      },
      increaseItemQuantity : (id:number,type : 'increment' | 'decrement') => {
        set(state =>({
          totalCartProduct : state.totalCartProduct.map((item)=>{
            if(item.id === id){
              const newQuantity = type === 'increment' ? (item.quantity || 1) + 1 : (item.quantity || 1) - 1;
              const updatePrice = newQuantity > 1 ? item.price * newQuantity : item.price;
              return {...item, newPrice : updatePrice ,quantity : newQuantity > 0 ? newQuantity : 1};
            }
            return item;
          })
        }))
      },
      clearCart : ()=>{
        set({totalCartProduct : []});
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
