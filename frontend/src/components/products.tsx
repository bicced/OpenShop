import Image from 'next/image';
import CreateProduct from './createproduct';
import { useAccount, useReadContract } from 'wagmi'
import { readContracts } from '@wagmi/core'
import { CONTRACT_CONFIG } from '@/contract/index'
import { config } from '@/config/wagmi'
import { useEffect, useState } from 'react'

export default function Products({isOwner}: {isOwner: boolean}) {
  const account = useAccount();
  const [products, setProducts] = useState<any[]>([])
  const [showCreateProductModal, setShowCreateProductModal] = useState<boolean>(false);
  const { data: productCount } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'productCount',
    args: [],
  })

  useEffect(() => {
    getProducts()
  } , [productCount])

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

  const toggleModal = () => {
    setShowCreateProductModal(!showCreateProductModal);
  };

  const ProductImage = ({ src, alt } : any) => {
    function isValidUrl(url: string) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }

    const placeholderImage = 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg';
    const imageUrl = isValidUrl(src) ? src : placeholderImage;

    const customImageLoader = ({ src }: any) => {
      return src;
    };
    
    return (
      <div className="flex justify-center items-center">
        <Image loader={customImageLoader} src={imageUrl} alt={alt} width={150} height={150} />
      </div>
    )
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <button className={`px-4 py-2 border-blue-600 border-4 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105`} onClick={() => setShowCreateProductModal(true)}>
        List a product +
      </button>
      
      {products.map(product => (
        <div key={product.id} className="bg-white bg-opacity-30 p-6 rounded-lg shadow-lg text-center">
          <ProductImage src={product.imageUrl} alt={product.name} />
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-lg mb-2">{Number(product.price)}</p>
          <p className="text-md">{product.description}</p>
          <p className="text-md">{product.seller}</p>
        </div>
      ))}
      { showCreateProductModal && <CreateProduct onClose={toggleModal} />}
    </div>
  )
}
