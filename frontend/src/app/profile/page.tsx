'use client';
import Products from '@/components/products';
import { useState } from 'react';

export default function SellerPage() {
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <Products isOwner={true} />;
      case 'sales':
        return (
          <div className="bg-white bg-opacity-30 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Sales</h2>
            <p className="text-md">Sales data will be displayed here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-8 mt-20">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>
      <div className="flex space-x-4 mb-8">
        <button className={`px-4 py-2 ${activeTab === 'products' ? 'bg-blue-600' : 'bg-white bg-opacity-30'} text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105`} onClick={() => setActiveTab('products')}>
          My Products
        </button>
        <button className={`px-4 py-2 ${activeTab === 'sales' ? 'bg-blue-600' : 'bg-white bg-opacity-30'} text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105`} onClick={() => setActiveTab('sales')}>
          My Sales
        </button>
        <button className={`px-4 py-2 ${activeTab === 'purchases' ? 'bg-blue-600' : 'bg-white bg-opacity-30'} text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105`} onClick={() => setActiveTab('purchases')}>
          My Purchases
        </button>
      </div>
      {renderContent()}
    </div>
  );
}
