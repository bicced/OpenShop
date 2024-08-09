import { CONTRACT_CONFIG } from '@/contract';
import React, { useState, useEffect } from 'react';
import {   
  type BaseError,
  useWriteContract, 
  useWaitForTransactionReceipt 
} from 'wagmi';

interface IProps {
  onClose: () => void;
}

export default function CreateProduct({onClose}: IProps) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value
    }));
  };

  const onSubmit = async (e: any) => {
    e.preventDefault(); // Prevent default form submission
    const { name, description, price, imageUrl } = formData;
    console.log('Creating product:', name, description, price, imageUrl);
    setMessage('Submitting transaction...');
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'createProduct',
      args: [name, description, imageUrl, Number(price)]
    });
  };

  // Effect to update message based on transaction status
  useEffect(() => {
    if (isPending) {
      setMessage('Transaction is pending...');
    } else if (isConfirming) {
      setMessage('Transaction is confirming...');
    } else if (isConfirmed) {
      setMessage('Transaction confirmed successfully!');
      onClose();
    } else if (error) {
      setMessage(`Error: ${(error as BaseError).shortMessage || error.message}`);
    } else {
      setMessage('');
    }
  }, [isPending, isConfirming, isConfirmed, error]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-80" onClick={onClose}></div>
      <div className="relative bg-white bg-opacity-30 p-6 rounded-lg shadow-lg z-10 w-full max-w-lg lg:max-w-2xl xl:max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Create a New Product</h2>
        {message && (
          <div className="mb-4 p-2 text-white bg-blue-500 rounded">
            {message}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
              Product Name
            </label>
            <input 
              disabled={isPending || isConfirming}
              className="w-full px-3 py-2 text-black leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline" 
              id="name" 
              type="text" 
              placeholder="Product Name" 
              value={formData.name} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea 
              disabled={isPending || isConfirming}
              className="w-full px-3 py-2 text-black leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline" 
              id="description" 
              placeholder="Description" 
              value={formData.description} 
              onChange={handleInputChange} 
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input 
              disabled={isPending || isConfirming}
              className="w-full px-3 py-2 text-black leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline" 
              id="price" 
              type="text" 
              placeholder="Price" 
              value={formData.price} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="imageUrl">
              Image URL
            </label>
            <input 
              disabled={isPending || isConfirming}
              className="w-full px-3 py-2 text-black leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline" 
              id="imageUrl" 
              type="text" 
              placeholder="Image URL" 
              value={formData.imageUrl} 
              onChange={handleInputChange} 
            />
          </div>
          <button 
            disabled={isPending || isConfirming}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105" 
            type="submit"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}
