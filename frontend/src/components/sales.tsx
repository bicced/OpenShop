"use client";
import { CONTRACT_CONFIG } from '@/contract/index';
import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { readContracts } from '@wagmi/core';
import { config } from '@/config/wagmi';
import { useTransactionContext } from '@/config/transactioncontext';


export default function Sales() {
  const account = useAccount();
  const { writeContract } = useTransactionContext();
  const [sales, setSales] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [shipmentInfo, setShipmentInfo] = useState('');

  const { data: purchaseCount } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'purchaseCount',
    args: [],
  });

  useEffect(() => {
    getSales();
  }, [purchaseCount]);

  const getSales = async () => {
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
      });
      const filteredPurchases = response.map((data: any) => data.result).filter((data: any) => data.seller === account.address);
      setSales(filteredPurchases);
      console.log(filteredPurchases);
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = (purchase: any) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShipmentInfo('');
  };

  const handleShipmentSubmit = async () => {
    // Handle the shipment creation logic here
    // For example, sending the shipment info to a contract or backend
    console.log(`Shipment info submitted: ${shipmentInfo} for purchase ID: ${selectedPurchase.id}`);
    if (!writeContract) return;

    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'createShipment',
      args: [selectedPurchase.id, shipmentInfo],
    });
    closeModal();
  };

  return (
    <>
      <ul>
        {sales.map((purchase, index) => (
          <li key={index} className="relative p-4 bg-white bg-opacity-30 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="absolute top-2 right-2">
              {purchase.shipmentCreated ? (
                <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-green-500 text-white">Completed</span>
              ) : (
                <button
                  onClick={() => openModal(purchase)}
                  className="px-2 py-1 text-xs font-semibold rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Create Shipment +
                </button>
              )}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-white">Product ID:</span> {Number(purchase.id)}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-white">Buyer:</span> {purchase.buyer}
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-80" onClick={() => setIsModalOpen(false)} aria-label="Close form"></div>
          <div className="relative bg-gray-900 border-2 border-pink-600 bg-opacity-90 p-6 rounded-lg shadow-lg z-10 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Provide Tracking URL</h2>
            <input
              type="text"
              value={shipmentInfo}
              onChange={(e) => setShipmentInfo(e.target.value)}
              placeholder="https://www.dhl.com/ca-en/home/tracking.html?tracking-id=wef"
              className="w-full px-3 py-2 text-black leading-tight border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
            <button
              className="mt-4 px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-transform transform w-full bg-pink-600 hover:bg-pink-700 hover:scale-105"
              type="submit"
              onClick={handleShipmentSubmit}
              aria-label="Create Shipment"
            >
              Create Shipment
            </button>
          </div>
        </div>
      )}
    </>
  );
}
