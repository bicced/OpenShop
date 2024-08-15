"use client";
import CreateProduct from './createproduct';
import { CONTRACT_CONFIG } from '@/contract/index'
import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { readContracts } from '@wagmi/core'
import { config } from '@/config/wagmi'
import Product from './product';

export default function Products({isOwner}: {isOwner: boolean}) {
  const account = useAccount();
  const [products, setProducts] = useState<any[]>([])
  const [showCreateProductModal, setShowCreateProductModal] = useState<boolean>(false);

  const { data: productCount } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'productCount',
    args: [],
  })

  const { data: hash, writeContract, error } = useWriteContract();


  useEffect(() => {
    getProducts()
  } , [productCount])


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
      {showCreateProductModal && <CreateProduct closeCreateProductModal={() => setShowCreateProductModal(false)} />}
    </div>
  )
}
