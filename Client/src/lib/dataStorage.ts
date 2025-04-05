import stocksData from './stocks.json';

const dataStorage = () => {
  // Convert the object values to an array and store each stock
  Object.values(stocksData).forEach(stock => {
    if (stock.ticker) {
      localStorage.setItem(stock.ticker, JSON.stringify(stock));
    }
  });
  
  return Object.values(stocksData);
}

export default dataStorage;