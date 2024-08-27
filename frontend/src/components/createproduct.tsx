import { CONTRACT_CONFIG } from '@/contract';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAccount } from 'wagmi';
import { useTransactionContext } from '@/config/transactioncontext';

interface IProps {
  closeCreateProductModal: () => void;
}

export default function CreateProduct({ closeCreateProductModal }: IProps) {
  const account = useAccount();
  const { writeContract } = useTransactionContext();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const onCreateProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCreateProduct(formData);
  };

  const handleCreateProduct = async (formData: { name: string; description: string; price: string; imageUrl: string }) => {
    const { name, description, price, imageUrl } = formData;
    if (!account?.chain?.nativeCurrency.decimals) {
      console.error("Native currency decimals not found.");
      return;
    }
    const priceInWei = BigInt(Math.floor(Number(price) * 10 ** account?.chain?.nativeCurrency.decimals));
    if (priceInWei <= 0n) {
      console.error("Price must be greater than zero.");
      return;
    }
    const args = [name, description, imageUrl, priceInWei.toString()];
    if (!writeContract) return;
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'createProduct',
      args
    });
    closeCreateProductModal(); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-80" onClick={closeCreateProductModal} aria-label="Close form"></div>
      <div className="relative bg-gray-900 border-2 border-pink-600 bg-opacity-90 p-6 rounded-lg shadow-lg z-10 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Create a New Product</h2>
        <form onSubmit={onCreateProduct}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
              Product Name
            </label>
            <input
              required
              className="w-full px-3 py-2 text-black leading-tight border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-pink-600"
              id="name"
              type="text"
              placeholder="Straw Hat"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="price">
              Price ({account?.chain?.nativeCurrency?.symbol || 'ETH'})
            </label>
            <input
              required
              className="w-full px-3 py-2 text-black leading-tight border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-pink-600"
              id="price"
              type="text"
              placeholder="0"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="imageUrl">
              Image URL
            </label>
            <input
              required
              className="w-full px-3 py-2 text-black leading-tight border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-pink-600"
              id="imageUrl"
              type="text"
              placeholder="https://example.com/strawhat.jpg"
              value={formData.imageUrl}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              required
              className="w-full px-3 py-2 text-black leading-tight border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-pink-600"
              id="description"
              placeholder="A hat made of straw, crafted by the finest straw hat maker in the world. Fit for a pirate king!"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <button
            className="px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-transform transform w-full bg-pink-600 hover:bg-pink-700 hover:scale-105"
            type="submit"
            aria-label="Create Product"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}
