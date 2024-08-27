# OpenShop

OpenShop is a fully on-chain marketplace for physical goods built on the BNB Chain. This repository includes both the smart contract and the frontend, allowing users to create, purchase, and manage products while ensuring secure transactions and encrypted delivery details.

This was built for the BNB Hackathon and currently deployed on BSC Testnet: 0x555F64D0FBF7f0A5D308E6165F98F41556f31f7F

## Features

- **Product Creation**: Sellers can create and list products with details such as name, description, image URL, and price.
- **Product Purchase**: Buyers can purchase listed products, providing an encrypted delivery address for privacy.
- **Shipment Management**: Sellers can create shipments for purchased products, with encrypted tracking information stored on-chain.
- **Availability Control**: Sellers can toggle the availability of their products.
- **Secure Data**: Delivery addresses and tracking URLs are encrypted, ensuring privacy and security for both buyers and sellers.

## Smart Contract Overview

### Structs

- **Product**: Stores product details such as ID, seller, name, description, image URL, price, availability, and timestamp.
- **Purchase**: Contains purchase details including ID, product ID, seller, buyer, encrypted delivery address, shipment status, shipment ID, and timestamp.
- **Shipment**: Holds shipment details including ID, purchase ID, encrypted tracking URL, and timestamp.

### Functions

- **createProduct**: Allows a seller to create a new product.
- **purchaseProduct**: Enables a buyer to purchase a product by providing an encrypted delivery address and sending the exact product price.
- **changeProductAvailability**: Lets the seller change the availability status of a product.
- **createShipment**: Allows the seller to create a shipment for a purchase and stores the encrypted tracking URL.
- **getProduct**: Retrieves details of a specific product.
- **getPurchase**: Retrieves details of a specific purchase.
- **getShipment**: Retrieves details of a specific shipment, accessible only by the buyer or seller.

### Events

- **ProductCreated**: Emitted when a new product is created.
- **ProductPurchased**: Emitted when a product is purchased.
- **ProductAvailabilityChanged**: Emitted when a product's availability status changes.
- **ShipmentCreated**: Emitted when a shipment is created.

## Frontend Overview

The frontend of OpenShop is a web application that interacts with the smart contract, allowing users to browse products, make purchases, and track shipments.

### Key Features

- **Product Listing**: Browse all available products on the marketplace.
- **Purchase Flow**: Securely purchase products by interacting with the smart contract.
- **Shipment Tracking**: Track shipments using encrypted tracking URLs.

### Technologies Used

- **React**: For building the user interface.
- **Web3.js**: For interacting with the smart contract on the BNB Chain.
- **Tailwind CSS**: For styling the application.
- **Ethers.js**: For blockchain interactions.

## Installation

### Smart Contract

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/OpenShop.git
    cd OpenShop
    ```

2. **Install Dependencies**:
    Ensure you have Node.js and npm installed. Then, install the required dependencies:
    ```bash
    npm install
    ```

3. **Deploy the Contract**:
    Use your preferred method (e.g., Hardhat, Truffle) to deploy the contract to a blockchain network.

4. **Interact with the Contract**:
    Use a Web3 provider like Remix, Hardhat, or a front-end application to interact with the deployed contract.

### Frontend

1. **Navigate to the Frontend Directory**:
    ```bash
    cd frontend
    ```

2. **Install Frontend Dependencies**:
    ```bash
    npm install
    ```

3. **Configure Environment Variables**:
    Create a `.env` file in the `frontend` directory and add the necessary environment variables (e.g., API keys, contract addresses).

4. **Start the Development Server**:
    ```bash
    npm start
    ```
    This will start the application on `http://localhost:3000`.

## Usage

1. **Create a Product**:
    On the frontend, use the product creation form to list a new product.

2. **Purchase a Product**:
    Browse available products and purchase one by following the on-screen instructions. You'll need to provide an encrypted delivery address during checkout.

3. **Create a Shipment**:
    As a seller, after a purchase is made, create a shipment and provide an encrypted tracking URL.

4. **Track a Shipment**:
    Buyers can track their shipments using the tracking URL provided by the seller.

## Security Considerations

- **Encryption**: Ensure that delivery addresses and tracking URLs are properly encrypted before sending them to the smart contract.
- **Data Privacy**: Only the buyer and seller have access to sensitive shipment details, ensuring privacy.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
