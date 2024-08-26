"use client";
import { CONTRACT_CONFIG } from '@/contract/index'
import { useEffect, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { readContracts } from '@wagmi/core'
import { config } from '@/config/wagmi'

export default function Purchases() {
  const account = useAccount();
  const [purchases, setPurchases] = useState<any[]>([])

  const { data: purchaseCount } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'purchaseCount',
    args: [],
  })

  useEffect(() => {
    getPurchases()
  } , [purchaseCount])

  const getPurchases = async () => {
    const contracts: any = [];
    for (let i = 1; i <= Number(purchaseCount); i++) {
      contracts.push({
        ...CONTRACT_CONFIG,
        functionName: 'getPurchase',
        args: [i],
      });
    }

    try {
      const response = await readContracts(config, {
        contracts,
      })
      const filteredPurchases = response.map((data: any) => data.result).filter((data: any) => data.buyer === account.address);
      setPurchases(filteredPurchases);
    }
    catch (err) {
      console.log(err);
    }
  }

  async function renderShipmentInfo(purchase: any) { 
    console.log(purchase)
    if (!purchase.shipmentCreated) return;
    const contracts: any = [];
    contracts.push({
      ...CONTRACT_CONFIG,
      functionName: 'getShipment',
      args: [Number(purchase.shipmentId)]
    })
    const response = await readContracts(config, {
      contracts
    })

    console.log(response)
    return;
    // return (
    //   <div className="mb-2">
    //     <span className="font-semibold text-white">Shipment Info:</span>
    //   </div>
    // );

  }

  return (
    <ul>
      {purchases.map((purchase, index) => (
        <li key={index} className="relative p-4 bg-white bg-opacity-30 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="absolute top-2 right-2">
            <span
              onClick={() => {renderShipmentInfo(purchase)}}
              className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                purchase.shipmentCreated ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
              }`}
            >
              {purchase.shipmentCreated ? 'Completed' : 'Pending'}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-white">Product ID:</span> {Number(purchase.id)}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-white">Seller:</span> {purchase.seller}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-white">Delivery Address:</span> {purchase.deliveryAddress}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-white">Timestamp:</span> {new Date(Number(purchase.timestamp) * 1000).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}
