import { inject, provide, reactive } from '@vue/runtime-core';
import Stock from '@/model/Stock';
import firebaseClient from '@/api/firebase';

const StockSymbol = Symbol();

const createContext = () => {
  const state = reactive({
    stocks: [] as Stock[],
  });

  const methods = {
    fetchStocks: async () => {
      const result: Stock[] = [];
      await firebaseClient.getStockDatum().then((querySnapshot) => {
        querySnapshot.forEach((doc) => result.push(new Stock(doc.data() as StockPropertyType)));
      });
      state.stocks = result;
    },
    deleteStock: async (deleteStock: Stock) => {
      await firebaseClient.deleteStockDatum(deleteStock.symbol);
      state.stocks = state.stocks.filter((stock) => stock.symbol !== deleteStock.symbol);
    },
    hasDividendStocks: () => {
      return state.stocks.filter((stock) => stock.frequency);
    },
  };

  methods.fetchStocks();

  return {
    stockState: state,
    stockMethods: methods,
  };
};

export const provideStock = () => {
  const context = createContext();
  provide(StockSymbol, context);
};

export const injectStock = () => {
  const context = inject(StockSymbol) as ReturnType<typeof createContext>;
  if (!context) throw Error('inject stock error');
  return context;
};
