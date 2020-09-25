import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const productsCart = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );

      if (productsCart) {
        setProducts(JSON.parse(productsCart));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      const cartCopy = [...products];

      const productAlreadyExists = cartCopy.find(
        productItem => productItem.id === product.id,
      );

      if (productAlreadyExists) {
        productAlreadyExists.quantity += 1;
      } else {
        cartCopy.push({ ...product, quantity: 1 });
      }

      setProducts(cartCopy);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(cartCopy),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const cartCopy = [...products];

      const productAlreadyExists = cartCopy.find(
        productItem => productItem.id === id,
      );

      if (productAlreadyExists) {
        productAlreadyExists.quantity += 1;
      } else {
        cartCopy;
      }

      setProducts(cartCopy);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(cartCopy),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const cartCopy = [...products];

      const productAlreadyExists = cartCopy.find(
        productItem => productItem.id === id,
      );

      if (productAlreadyExists) {
        productAlreadyExists.quantity -= 1;
      } else {
        cartCopy;
      }

      setProducts(cartCopy);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(cartCopy),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
