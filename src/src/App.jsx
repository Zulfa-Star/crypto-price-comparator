
import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [binanceRes, indodaxRes] = await Promise.all([
          axios.get("https://api.binance.com/api/v3/ticker/bookTicker"),
          axios.get("https://indodax.com/api/tickers")
        ]);

        const coins = ["BTCUSDT", "ETHUSDT"];
        const binanceData = binanceRes.data.filter(item => coins.includes(item.symbol));

        const indodaxData = coins.map(symbol => {
          const iddxSymbol = symbol.toLowerCase().replace("usdt", "idr");
          const ticker = indodaxRes.data.tickers[iddxSymbol];
          return {
            symbol,
            exchange: "Indodax",
            askPrice: parseFloat(ticker.sell),
            bidPrice: parseFloat(ticker.buy)
          };
        });

        const formattedBinance = binanceData.map(item => ({
          symbol: item.symbol,
          exchange: "Binance",
          askPrice: parseFloat(item.askPrice),
          bidPrice: parseFloat(item.bidPrice)
        }));

        setData([...formattedBinance, ...indodaxData]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Crypto Price Comparator</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Exchange</th>
            <th className="px-4 py-2">Bid Price</th>
            <th className="px-4 py-2">Ask Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{row.symbol}</td>
              <td className="px-4 py-2">{row.exchange}</td>
              <td className="px-4 py-2 text-green-600">{row.bidPrice.toLocaleString()}</td>
              <td className="px-4 py-2 text-red-600">{row.askPrice.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
