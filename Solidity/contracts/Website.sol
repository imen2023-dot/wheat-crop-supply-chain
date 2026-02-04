// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Website {
    address private adminAddress = 0x36791A5FEa70814e9E9ab1d6A03F623c2386Cd04;
    uint256 tid;
    struct Transportation {
        address farmer;
        address transporter;
        address silo;
        bool isRated;
        uint32 weight;
        string status;
        string date;
        string pickUpDate;
        string deliviredDate;
        string ssiHash;
        uint8 rating;
    }
    struct User {
        string mail;
        string password;
        address account;
        string cid;
        string role;
        string status;
    }

    struct Farmer {
        User user;
        string name;
        uint32 number;
        string location;
        uint256[] transportations;
    }

    struct Transporter {
        User user;
        string name;
        string licensePlate;
        uint32 carCapacity;
        string location;
        uint256[] transportations;
        uint8 rating;
    }

    struct Silo {
        User user;
        string location;
        uint32 capacity;
        uint32 quantity;
        uint256[] transportations;
    }

    User private admin;
    event UserAdded(address indexed Address, string role, string mail);
    event emettedEvent(address indexed sender, string message);
    event ResponseMessage(address indexed sender, string message);
    mapping(address => Farmer) public farmers;
    address[] private farmerAdd;
    // event FarmerAdded(address indexed farmerAddress, string name, string mail);

    mapping(address => Transporter) public transporters;
    address[] private transporterAdd;
    // event TransporterAdded(address indexed transporterAddress, string licensePlate, string mail);

    mapping(address => Silo) public silos;
    address[] private siloAdd;

    mapping(uint256 => Transportation) public transportations;

    // event SiloAdded(address indexed siloAddress, uint32 capacity , string mail);

    constructor() public {
        admin = User(
            "admin@gmail.com",
            "12345678",
            0x36791A5FEa70814e9E9ab1d6A03F623c2386Cd04,
            "",
            "Admin",
            "Active"
        );
        tid = 0;
        string memory commonMail = "example@example.com";
        string memory commonPassword = "123";
        string memory commonCid = "";
        string memory commonLocation = "Sfax";
        string memory farmerName = "FarmerName";
        uint32 farmerNumber = 12345;
        string memory transporterName = "TransporterName";
        string memory transporterLicensePlate = "ABC123";
        uint32 transporterCarCapacity = 1000;
        uint8 transporterRating = 1;
        uint32 siloCapacity = 5000;
        uint32 siloQuantity = 2500;

        farmers[0x65ef61531C2E8Ce187242ae42E39AD225e56346E] = Farmer(
            User(
                commonMail,
                commonPassword,
                0x65ef61531C2E8Ce187242ae42E39AD225e56346E,
                commonCid,
                "Farmer",
                "Activated"
            ),
            farmerName,
            farmerNumber,
            commonLocation,
            new uint[](0)
        );
        farmerAdd.push(0x65ef61531C2E8Ce187242ae42E39AD225e56346E);
        emit emettedEvent(0x65ef61531C2E8Ce187242ae42E39AD225e56346E, "Farmer added successfully");

        // Initialize Transporter
        transporters[0xd3EF445Fc804e207F640B8538Fd9A02A9783F8d3] = Transporter(
            User(
                commonMail,
                commonPassword,
                0xd3EF445Fc804e207F640B8538Fd9A02A9783F8d3,
                commonCid,
                "Transporter",
                "Activated"
            ),
            transporterName,
            transporterLicensePlate,
            transporterCarCapacity,
            commonLocation,
            new uint[](0),
            transporterRating
        );
        transporterAdd.push(0xd3EF445Fc804e207F640B8538Fd9A02A9783F8d3);
        emit emettedEvent(0xd3EF445Fc804e207F640B8538Fd9A02A9783F8d3, "Transporter added successfully");

        // Initialize Silo
        silos[0x954fA63C60A3676507de18073c1fc69D0CA40876] = Silo(
            User(
                commonMail,
                commonPassword,
                0x954fA63C60A3676507de18073c1fc69D0CA40876,
                commonCid,
                "Silo",
                "Activated"
            ),
            "[33.8815, 10.0982]",
            siloCapacity,
            siloQuantity,
            new uint[](0)
        );
        emit emettedEvent(0x954fA63C60A3676507de18073c1fc69D0CA40876, "Silo added successfully");

        siloAdd.push(0x954fA63C60A3676507de18073c1fc69D0CA40876);
    }

    modifier onlyOwner() {
        require(
            msg.sender == adminAddress,
            "Only the admin can call this function"
        );
        _;
    }
    modifier onlyFarmer() {
        require(
            farmers[msg.sender].user.account != address(0),
            "Caller is not a farmer"
        );
        _;
    }

    modifier onlyTransporter() {
        require(
            transporters[msg.sender].user.account != address(0),
            "Caller is not a transporter"
        );
        _;
    }

    modifier onlySilo() {
        require(
            silos[msg.sender].user.account != address(0),
            "Caller is not a silo"
        );
        _;
    }
    modifier onlyAuthorized() {
        require(
            farmers[msg.sender].user.account != address(0) ||
                transporters[msg.sender].user.account != address(0) ||
                silos[msg.sender].user.account != address(0)||
                msg.sender == adminAddress,
            "Caller is not authorized"
        );
        _;
    }

    function verify(
        string memory email,
        string memory pass
    ) public view returns (string memory) {
        if (
            msg.sender == admin.account &&
            keccak256(bytes(admin.mail)) == keccak256(bytes(email)) &&
            keccak256(bytes(admin.password)) == keccak256(bytes(pass))
        ) {
            return admin.role;
        }

        if (
            farmers[msg.sender].user.account != address(0) &&
            keccak256(bytes(farmers[msg.sender].user.mail)) ==
            keccak256(bytes(email)) &&
            keccak256(bytes(farmers[msg.sender].user.password)) ==
            keccak256(bytes(pass))
        ) {
            return farmers[msg.sender].user.role;
        }

        if (
            transporters[msg.sender].user.account != address(0) &&
            keccak256(bytes(transporters[msg.sender].user.mail)) ==
            keccak256(bytes(email)) &&
            keccak256(bytes(transporters[msg.sender].user.password)) ==
            keccak256(bytes(pass))
        ) {
            return transporters[msg.sender].user.role;
        }

        if (
            silos[msg.sender].user.account != address(0) &&
            keccak256(bytes(silos[msg.sender].user.mail)) ==
            keccak256(bytes(email)) &&
            keccak256(bytes(silos[msg.sender].user.password)) ==
            keccak256(bytes(pass))
        ) {
            return silos[msg.sender].user.role;
        }

        return ("Invalid credentials");
    }

    function addFarmers(Farmer[] memory farmer) public onlyOwner {
        for (uint i = 0; i < farmer.length; i++) {
            if (farmer[i].user.account == address(0)) {
                emit ResponseMessage(address(0), "Invalid user account");
                continue;
            }
            if (farmers[farmer[i].user.account].user.account != address(0)) {
                emit ResponseMessage(
                    farmer[i].user.account,
                    "User already exists"
                );
                continue;
            }
            farmers[farmer[i].user.account] = farmer[i];
            farmerAdd.push(farmer[i].user.account);
            emit emettedEvent(farmer[i].user.account, "Farmer added successfully");

        }
    }

    function addTransporters(
        Transporter[] memory transporter
    ) public onlyOwner {
        for (uint i = 0; i < transporter.length; i++) {
            if (transporter[i].user.account == address(0)) {
                emit ResponseMessage(address(0), "Invalid user account");
                continue;
            }
            if (
                transporters[transporter[i].user.account].user.account !=
                address(0)
            ) {
                emit ResponseMessage(
                    transporter[i].user.account,
                    "User already exists"
                );
                continue;
            }
            transporters[transporter[i].user.account] = transporter[i];
            transporterAdd.push(transporter[i].user.account);
            emit emettedEvent(transporter[i].user.account, "Transporter added successfully");

        }
    }

    function addSilos(Silo[] memory silo) public onlyOwner {
        for (uint i = 0; i < silo.length; i++) {
            if (silo[i].user.account == address(0)) {
                emit ResponseMessage(address(0), "Invalid user account");
                continue;
            }
            if (silos[silo[i].user.account].user.account != address(0)) {
                emit ResponseMessage(
                    silo[i].user.account,
                    "User already exists"
                );
                continue;
            }
            silos[silo[i].user.account] = silo[i];
            siloAdd.push(silo[i].user.account);
            emit emettedEvent(silo[i].user.account, "Silo added successfully");

        }
    }

    function getFarmers() public view onlyOwner returns (address[] memory) {
        return farmerAdd;
    }

    function getTransporters() public view  returns (address[] memory) {
        return transporterAdd;
    }

    function getSilos() public view  returns (address[] memory) {
        return siloAdd;
    }

    function addCid(string memory cid, string memory role) public onlyAuthorized{
        if ((keccak256(bytes(role)) == keccak256(bytes("Farmer")))) {
            farmers[msg.sender].user.cid = cid;
            emit emettedEvent(msg.sender, "Farmer added a permit.");
        } else if ((keccak256(bytes(role)) == keccak256(bytes("Silo")))) {
            silos[msg.sender].user.cid = cid;
            emit emettedEvent(msg.sender, "Silo added a permit.");

        } else if (
            (keccak256(bytes(role)) == keccak256(bytes("Transporter")))
        ) {
            transporters[msg.sender].user.cid = cid;
            emit emettedEvent(msg.sender, "Transporter added a permit.");

        }
    }

    function changePassword(
        string memory newPassword,
        string memory oldPassword,
        string memory role
    ) public onlyAuthorized returns (string memory) {
        if ((keccak256(bytes(role)) == keccak256(bytes("Farmer")))) {
            if (
                keccak256(bytes(farmers[msg.sender].user.password)) ==
                keccak256(bytes(newPassword))
            ) {
                return "New password cannot be the same as the old one.";
            } else if (
                keccak256(bytes(farmers[msg.sender].user.password)) !=
                keccak256(bytes(oldPassword))
            ) {
                return "Wrong old password!";
            } else {
                farmers[msg.sender].user.password = newPassword;
                return "Password changed successfully!";
            }
        } else if ((keccak256(bytes(role)) == keccak256(bytes("Silo")))) {
            if (
                keccak256(bytes(silos[msg.sender].user.password)) ==
                keccak256(bytes(newPassword))
            ) {
                return "New password cannot be the same as the old one.";
            } else if (
                keccak256(bytes(silos[msg.sender].user.password)) !=
                keccak256(bytes(oldPassword))
            ) {
                return "Wrong old password!";
            } else {
                silos[msg.sender].user.password = newPassword;
                return "Password changed successfully!";
            }
        } else if (
            (keccak256(bytes(role)) == keccak256(bytes("Transporter")))
        ) {
            if (
                keccak256(bytes(transporters[msg.sender].user.password)) ==
                keccak256(bytes(newPassword))
            ) {
                return "New password cannot be the same as the old one.";
            } else if (
                keccak256(bytes(transporters[msg.sender].user.password)) !=
                keccak256(bytes(oldPassword))
            ) {
                return "Wrong old password!";
            } else {
                transporters[msg.sender].user.password = newPassword;
                return "Password changed successfully!";
            }
        }
    }

    function changeStatus(
        string memory status,
        string memory role,
        address userAddress
    ) public onlyOwner {
        if ((keccak256(bytes(role)) == keccak256(bytes("Farmer")))) {
            farmers[userAddress].user.status = status;
        } else if ((keccak256(bytes(role)) == keccak256(bytes("Silo")))) {
            silos[userAddress].user.status = status;
        } else if (
            (keccak256(bytes(role)) == keccak256(bytes("Transporter")))
        ) {
            transporters[userAddress].user.status = status;
        }
    }

    function addTransportation (Transportation memory transportation) public onlyFarmer{
        tid = tid + 1;
        transportations[tid] = transportation;
        transporters[transportation.transporter].transportations.push(tid);
        farmers[transportation.farmer].transportations.push(tid);
        silos[transportation.silo].transportations.push(tid);
         emit emettedEvent(msg.sender, "Farmer added a Transporation.");

    }

    function changeTransportationStatus (
        string memory status,
        uint256 id
    ) public  onlyAuthorized{
        transportations[id].status = status;
    }

    function transportationHash(string memory hash, uint256 id) public onlyAuthorized {
        transportations[id].ssiHash = hash;
    }

    function rateTransportation(uint8 rating, uint256 id) public onlyFarmer {
        transportations[id].rating = rating;
        transportations[id].isRated = true;
        transporters[transportations[id].transporter].rating =
            (transporters[transportations[id].transporter].rating + rating) /
            2;
    }
    function getFarmerTransportations(
        address farmerAddress
    ) public view returns (uint256[] memory)  {
        return farmers[farmerAddress].transportations;
    }

    function getTransporterTransportations (
        address transporterAddress
    ) public view returns (uint256[] memory) {
        return transporters[transporterAddress].transportations;
    }

    function getSiloTransportations (
        address siloAddress
    ) public view returns (uint256[] memory) {
        return silos[siloAddress].transportations;
    }

    function pickYield(string memory date, uint256 id) public onlyTransporter{
        transportations[id].status = "Picked";
        transportations[id].pickUpDate = date;
        emit emettedEvent(msg.sender, "Transporter picked a Yield.");

    }

    function transportYield(string memory date, uint256 id) public onlySilo{
        transportations[id].status = "Transported";
        transportations[id].deliviredDate = date;
        emit emettedEvent(msg.sender, "Silo validated a Yield.");

    }
}