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
    }

    struct Purchase {
        uint productId;
        address buyer;
        string deliveryAddress; // Encrypted address
        bool shipmentCreated;
        uint timestamp;
    }

    struct Shipment {
        uint purchaseId;
        string encryptedTrackingUrl;
    }

    struct Rating {
        uint purchaseId;
        uint rating;
        string comment;
    }

    uint public productCount = 0;
    uint public purchaseCount = 0;
    mapping(uint => Product) public products;
    mapping(uint => Purchase) public purchases;
    mapping(uint => Shipment) public shipments;
    mapping(uint => Rating) public ratings;

    event ProductCreated(uint productId, address indexed seller, string name, uint price);
    event ProductPurchased(uint productId, address indexed buyer, string encryptedAddress);
    event ProductAvailabilityChanged(uint productId, bool isAvailable);
    event ShipmentCreated(uint purchaseId, string encryptedTrackingUrl);
    event SellerRated(uint purchaseId, uint rating, string comment);

    modifier validProduct(uint _productId) {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        _;
    }

    modifier validPurchase(uint _purchaseId) {
        require(_purchaseId > 0 && _purchaseId <= purchaseCount, "Purchase does not exist");
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
        products[productCount] = Product(productCount, payable(msg.sender), _name, _description, _imageUrl, _price, true);

        emit ProductCreated(productCount, msg.sender, _name, _price);
    }

    function purchaseProduct(uint _productId, string memory _encryptedAddress) public payable validProduct(_productId) {
        Product memory _product = products[_productId];
        require(msg.value == _product.price, "Incorrect amount");
        require(_product.isAvailable, "Product is not available");

        _product.seller.transfer(msg.value);
        purchaseCount++;
        purchases[purchaseCount] = Purchase(_productId, msg.sender, _encryptedAddress, false, block.timestamp);

        emit ProductPurchased(_productId, msg.sender, _encryptedAddress);
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

        shipments[_purchaseId] = Shipment(_purchaseId, _encryptedTrackingUrl);
        purchase.shipmentCreated = true;

        emit ShipmentCreated(_purchaseId, _encryptedTrackingUrl);
    }

    function rateSeller(uint _purchaseId, uint _rating, string memory _comment) public validPurchase(_purchaseId) onlyBuyer(_purchaseId) {
        require(block.timestamp >= purchases[_purchaseId].timestamp + 30 days, "Rating can only be given 30 days after purchase");
        require(_rating > 0 && _rating <= 5, "Rating must be between 1 and 5");

        ratings[_purchaseId] = Rating(_purchaseId, _rating, _comment);

        emit SellerRated(_purchaseId, _rating, _comment);
    }

    function getProduct(uint _productId) public view validProduct(_productId) returns (Product memory) {
        return products[_productId];
    }

    function getPurchase(uint _purchaseId) public view validPurchase(_purchaseId) returns (Purchase memory) {
        return purchases[_purchaseId];
    }

    function getShipment(uint _purchaseId) public view validPurchase(_purchaseId) returns (Shipment memory) {
        Shipment memory shipment = shipments[_purchaseId];
        require(purchases[_purchaseId].buyer == msg.sender || products[purchases[_purchaseId].productId].seller == msg.sender, "Only buyer or seller can view shipment details");
        return shipment;
    }

    function getRating(uint _purchaseId) public view validPurchase(_purchaseId) returns (Rating memory) {
        Rating memory rating = ratings[_purchaseId];
        require(purchases[_purchaseId].buyer == msg.sender || products[purchases[_purchaseId].productId].seller == msg.sender, "Only buyer or seller can view rating details");
        return rating;
    }
}
