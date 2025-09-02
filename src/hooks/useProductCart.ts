import { create } from 'zustand'

type Product = {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: { rate: number; count: number };
  title: string;
  quantity? : number
};

export const useProductCart = create((set)=>({
    totalCartProduct : <Product[]>[],
    addToCart : (data:Product) => set((state:Product)=>({totalCartProduct : [...state.totalCartProduct,{...data,quantity : 1}]})),
}))

