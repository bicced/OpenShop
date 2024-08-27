'use client';
import Products from '@/components/products';
import Purchases from '@/components/purchases';
import Sales from '@/components/sales';
import { useState } from 'react';

enum Tabs {
  PURCHASES = 'purchases',
  SALES = 'sales',
  PRODUCTS = 'products'
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState(Tabs.PURCHASES);

  const renderContent = () => {
    switch (activeTab) {
      case Tabs.PURCHASES:
        return <Purchases />;
      case Tabs.SALES:
        return <Sales />;
      case Tabs.PRODUCTS:
        return <Products isOwner={true} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-8 mt-20">
      <h1 className="text-5xl font-bold mb-8 bg-gradient-1 bg-clip-text text-transparent inline-block">My Profile</h1>
      <div className="flex space-x-4 mb-8">
        <button className={`px-4 py-2 ${activeTab === 'purchases' ? 'bg-pink-600' : 'bg-white bg-opacity-30'} text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition-transform transform hover:scale-105`} onClick={() => setActiveTab(Tabs.PURCHASES)}>
          My Purchases
        </button>
        <button className={`px-4 py-2 ${activeTab === 'sales' ? 'bg-pink-600' : 'bg-white bg-opacity-30'} text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition-transform transform hover:scale-105`} onClick={() => setActiveTab(Tabs.SALES)}>
          My Sales
        </button>
        <button className={`px-4 py-2 ${activeTab === 'products' ? 'bg-pink-600' : 'bg-white bg-opacity-30'} text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition-transform transform hover:scale-105`} onClick={() => setActiveTab(Tabs.PRODUCTS)}>
          My Products
        </button>
      </div>
      {renderContent()}
    </div>
  );
}
