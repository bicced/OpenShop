// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OpenShop {

    struct Product {
        uint id;
        address payable seller;
        string name;
        string description;
        string imageUrl;
        uint price;
        bool isAvailable;
        uint timestamp;
    }

    struct Purchase {
        uint id;  
        uint productId;
        address seller;
        address buyer;
        string deliveryAddress; // Encrypted address
        bool shipmentCreated;
        uint shipmentId;
        uint timestamp;
    }

    struct Shipment {
        uint id;
        uint purchaseId;
        string encryptedTrackingUrl;
        uint timestamp;
    }

    uint public productCount = 0;
    uint public purchaseCount = 0;
    uint public shipmentCount = 0;

    mapping(uint => Product) public products;
    mapping(uint => Purchase) public purchases;
    mapping(uint => Shipment) public shipments;

    event ProductCreated(uint productId, address indexed seller, string name, uint price);
    event ProductPurchased(uint purchaseId, uint productId, address indexed buyer, string encryptedAddress);
    event ProductAvailabilityChanged(uint productId, bool isAvailable);
    event ShipmentCreated(uint shipmentId, uint purchaseId, string encryptedTrackingUrl);

    modifier validProduct(uint _productId) {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        _;
    }

    modifier validPurchase(uint _purchaseId) {
        require(_purchaseId > 0 && _purchaseId <= purchaseCount, "Purchase does not exist");
        _;
    }

    modifier validShipment(uint _shipmentId) {
        require(_shipmentId > 0 && _shipmentId <= shipmentCount, "Shipment does not exist");
        _;
    }

    modifier onlySeller(uint _productId) {
        require(products[_productId].seller == msg.sender, "Only the seller can perform this action");
        _;
    }

    modifier onlyBuyer(uint _purchaseId) {
        require(purchases[_purchaseId].buyer == msg.sender, "Only the buyer can perform this action");
        _;
    }

    function createProduct(
        string memory _name,
        string memory _description,
        string memory _imageUrl,
        uint _price
    ) public {
        require(bytes(_name).length > 0, "Name is required");
        require(bytes(_description).length > 0, "Description is required");
        require(bytes(_imageUrl).length > 0, "Image URL is required");
        require(_price > 0, "Price must be greater than zero");

        productCount++;
        products[productCount] = Product(productCount, payable(msg.sender), _name, _description, _imageUrl, _price, true, block.timestamp);

        emit ProductCreated(productCount, msg.sender, _name, _price);
    }

    function purchaseProduct(uint _productId, string memory _encryptedAddress) public payable validProduct(_productId) {
        Product memory _product = products[_productId];
        require(msg.value == _product.price, "Incorrect amount");
        require(_product.isAvailable, "Product is not available");

        _product.seller.transfer(msg.value);
        purchaseCount++;
        purchases[purchaseCount] = Purchase(purchaseCount, _productId, _product.seller, msg.sender, _encryptedAddress, false, 0, block.timestamp);

        emit ProductPurchased(purchaseCount, _productId, msg.sender, _encryptedAddress);
    }

    function changeProductAvailability(uint _productId, bool _isAvailable) public validProduct(_productId) onlySeller(_productId) {
        products[_productId].isAvailable = _isAvailable;
        emit ProductAvailabilityChanged(_productId, _isAvailable);
    }

    function createShipment(uint _purchaseId, string memory _encryptedTrackingUrl) public validPurchase(_purchaseId) {
        Purchase storage purchase = purchases[_purchaseId];
        Product memory product = products[purchase.productId];
        require(product.seller == msg.sender, "Only the seller can create a shipment");
        require(!purchase.shipmentCreated, "Shipment already created");

        shipmentCount++;
        shipments[shipmentCount] = Shipment(shipmentCount, _purchaseId, _encryptedTrackingUrl, block.timestamp);
        purchase.shipmentCreated = true;
        purchase.shipmentId = shipmentCount;  // Save shipmentId to the purchase

        emit ShipmentCreated(shipmentCount, _purchaseId, _encryptedTrackingUrl);
    }

    function getProduct(uint _productId) public view validProduct(_productId) returns (Product memory) {
        return products[_productId];
    }

    function getPurchase(uint _purchaseId) public view validPurchase(_purchaseId) returns (Purchase memory) {
        return purchases[_purchaseId];
    }

    function getShipment(uint _shipmentId) public view validShipment(_shipmentId) returns (Shipment memory) {
        Shipment memory shipment = shipments[_shipmentId];
        require(purchases[shipment.purchaseId].buyer == msg.sender || products[purchases[shipment.purchaseId].productId].seller == msg.sender, "Only buyer or seller can view shipment details");
        return shipment;
    }
}
