"use client";
import CreateProduct from './createproduct';
import { CONTRACT_CONFIG } from '@/contract/index'
import { useEffect, useState } from 'react'
import { BaseError, useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { readContracts, getBalance } from '@wagmi/core'
import { config } from '@/config/wagmi'
import { useNotification } from '@/config/notificationprovider';
import Product from './product';

export default function Products({isOwner}: {isOwner: boolean}) {
  const account = useAccount();
  const { addNotification } = useNotification();
  const [products, setProducts] = useState<any[]>([])
  const [showCreateProductModal, setShowCreateProductModal] = useState<boolean>(false);

  const { data: productCount } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'productCount',
    args: [],
  })

  const { data: hash, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    getProducts()
  } , [productCount, isConfirmed])

  useEffect(() => {
    if (isConfirming) {
      addNotification({ id: Date.now().toString(), message: 'Transaction is confirming...', status: 'info', transactionHash: hash });
    } else if (isConfirmed) {
      addNotification({ id: Date.now().toString(), message: 'Transaction confirmed successfully!', status: 'success', transactionHash: hash });
    } else if (error) {
      addNotification({ id: Date.now().toString(), message: `Error: ${(error as BaseError).shortMessage || error.message}`, status: 'error', transactionHash: hash });
    }
  }, [isConfirming, isConfirmed, error]);

  const handleCreateProduct = async (formData: { name: string; description: string; price: string; imageUrl: string }) => {
    const { name, description, price, imageUrl } = formData;
    const priceInWei = BigInt(Math.floor(Number(price) * 10 ** account?.chain?.nativeCurrency.decimals));
    if (priceInWei <= 0n) {
      console.error("Price must be greater than zero.");
      return;
    }
    const args = [name, description, imageUrl, priceInWei.toString()];
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'createProduct',
      args
    });
    setShowCreateProductModal(false); 
  };

  const handlePurchaseProduct = async (productId: number, price: number, encryptedAddress: string) => {
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'purchaseProduct',
      args: [productId, encryptedAddress],
      value: BigInt(price)
    });
  };

  const getProducts = async () => {
    const contracts: any = [];
    for (let i = 1; i <= Number(productCount); i++) {
      contracts.push({
        ...CONTRACT_CONFIG,
        functionName: 'getProduct',
        args: [i],
      });
    }

    try {
      const response = await readContracts(config, {
        contracts,
      })
      const filteredProducts = response.map((data: any) => data.result).filter((data: any) => data.isAvailable && (isOwner ? data.seller === account.address : true));
      setProducts(filteredProducts);
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      <button className={`px-4 py-2 border-pink-600 border-4 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition-transform transform hover:scale-105`} onClick={() => setShowCreateProductModal(true)}>
        List a product +
      </button>
      {products.map(product => (<Product product={product} handlePurchaseProduct={handlePurchaseProduct} />))}
      {showCreateProductModal && (
        <CreateProduct closeCreateProductModal={() => setShowCreateProductModal(false)} handleCreateProduct={handleCreateProduct} />
      )}
    </div>
  )
}
