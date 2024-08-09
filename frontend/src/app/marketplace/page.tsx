'use client';
import Products from '@/components/products';
import Image from 'next/image';
import { useState } from 'react';

const buys = [
  {
    id: 1,
    name: 'Product 1',
    price: '$20',
    date: '2024-01-01',
  },
  {
    id: 2,
    name: 'Product 2',
    price: '$30',
    date: '2024-02-01',
  },
];

export default function BuyerPage() {
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <Products isOwner={false} />;
      case 'buys':
        return (
          <div className="bg-white bg-opacity-30 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Your Purchases</h2>
            <ul>
              {buys.map(buy => (
                <li key={buy.id} className="mb-4">
                  <h3 className="text-xl font-semibold">{buy.name}</h3>
                  <p className="text-md">{buy.price}</p>
                  <p className="text-sm text-gray-300">Purchased on {buy.date}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-8 mt-20">
      <h1 className="text-4xl font-bold mb-8">Marketplace</h1>
      {renderContent()}
    </div>
  );
}
