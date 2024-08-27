import { config, publicClient } from '@/config/wagmi';
import Image from 'next/image';
import { use, useState } from 'react';
import { getBlockNumber, getLogs } from 'viem/actions';
import { useAccount } from 'wagmi';

// const encryptContractAddress = async (contractAddress: string, ethAddress: string) => {

// };

const PLACEHOLDER_IMAGE = 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg';

const validImageUrl = (url: string) => {
  try {
    new URL(url);
    return url;
  } catch {
    return PLACEHOLDER_IMAGE;
  }
}

const customImageLoader = ({ src }: any) => {
  return src;
};

interface IProps {
  product: any,
  handlePurchaseProduct: (productId: number, productPrice: number, encryptedAddress: string) => void
}

enum ModalType {
  PRODUCT = 'product',
  PURCHASE = 'purchase'
}

export default function Product({ product, handlePurchaseProduct }: IProps) {
  const account = useAccount();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.PRODUCT);
  const [contractAddress, setContractAddress] = useState<string>('');
  const imageUrl = validImageUrl(product.imageUrl);

  const decimals = account?.chain?.nativeCurrency?.decimals || 18;
  const priceInWei = BigInt(product.price);
  const factor = BigInt(10) ** BigInt(decimals);
  const price = (priceInWei * BigInt(10 ** 18) / factor).toString();

  // Insert the decimal point at the correct position
  const formattedPrice = price.length > 18 
      ? price.slice(0, price.length - 18) + '.' + price.slice(price.length - 18).replace(/0+$/, '') 
      : '0.' + '0'.repeat(18 - price.length) + price.replace(/0+$/, '');
  const symbol = account?.chain?.nativeCurrency?.symbol;

  console.log(account?.chain)

  const productInfo = () => {
    return (
      <div className="text-left w-full md:w-1/2 lg:w-7/12 space-y-4">
        <h2 className="text-3xl font-extrabold text-white">{product.name}</h2>
        <p className="text-xl text-pink-400">Price: {formattedPrice} {symbol}</p>
        <p className="text-md text-gray-300 leading-relaxed">{product.description}</p>
        <div className="text-md text-gray-400">
          Seller: <span className="text-gray-200 break-words">{product.seller}</span>
        </div>
        <button onClick={() => setModalType(ModalType.PURCHASE)} className="w-full px-6 py-3 bg-pink-600 text-white font-bold rounded-md shadow-md hover:bg-pink-700 transition-colors duration-200">
          Buy Now
        </button>
      </div>
    )
  }

  const purchaseInfo = () => {
    const ethAddress = product.seller;

    const onSubmitPurchase = async () => {
      try {
        // const encryptedAddress = await encryptContractAddress(contractAddress, ethAddress);
        handlePurchaseProduct(product.id, product.price, contractAddress); // Implement and pass the encrypted address to the onSubmit handler
        setIsModalOpen(false);
      } catch (error) {
        console.error('Encryption failed:', error);
      }
    };
  
    return (
      <div className="text-left w-full md:w-1/2 lg:w-7/12 space-y-4">
        <h2 className="text-3xl font-extrabold text-white">Complete Your Purchase</h2>
        <p className="text-md text-gray-300 leading-relaxed">Provide as much information as possible - Country, Province, City, Address, Unit Number</p>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="Enter Delivery Address"
          className="w-full px-4 py-2 mb-4 bg-gray-800 text-white rounded-md focus:outline-none"
        />
        <button
          onClick={onSubmitPurchase}
          className="w-full px-6 py-3 bg-pink-600 text-white font-bold rounded-md shadow-md hover:bg-pink-700 transition-colors duration-200"
        >
          Confirm Purchase
        </button>
      </div>
    );
  };
  

  const renderModalInfo = () => {
    if (modalType === ModalType.PRODUCT) {
      return productInfo();
    }
    else if (modalType === ModalType.PURCHASE) {
      return purchaseInfo();
    }
  }

  const modal = () => {
    return (
      <div
        onClick={() => setIsModalOpen(false)} 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-300 px-4"
      >
        <div
          className="relative bg-gray-900 border border-gray-700 bg-opacity-95 p-6 rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105 z-10 w-full max-w-lg md:max-w-2xl lg:max-w-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8 w-full md:w-1/2 lg:w-5/12">
              <Image
                loader={customImageLoader}
                src={imageUrl}
                alt={product.alt}
                width={500}
                height={500}
                objectFit="contain"
                className="rounded-md shadow-lg w-full h-auto"
              />
            </div>
            {renderModalInfo()}
          </div>
        </div>
      </div>
    );
  };
  
  const openModal = (type: ModalType) => {
    setIsModalOpen(true);
    setModalType(type);
  }

  return (
    <div key={product.id} className="relative bg-white bg-opacity-30 rounded-lg shadow-lg text-center group">
      <div className="w-full h-40 relative overflow-hidden rounded-t-lg flex justify-center items-center bg-gray-200 cursor-pointer">
        <Image
          loader={customImageLoader}
          src={imageUrl}
          alt={product.alt}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div onClick={() => openModal(ModalType.PRODUCT)} className="product-info absolute inset-0 flex flex-col justify-center cursor-pointer items-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-lg mb-2">{formattedPrice} {symbol}</p>
      </div>
      <button onClick={() => openModal(ModalType.PURCHASE)} className="px-4 py-2 bg-pink-600 text-white font-semibold rounded-b-lg shadow-md hover:bg-pink-700 transition-transform transform hover:scale-105 w-full">
        Buy
      </button>
      {isModalOpen && modal()}
    </div>
  );
};
