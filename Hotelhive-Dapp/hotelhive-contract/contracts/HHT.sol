// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract HHT is ERC721 {
    address payable owner;
    struct roomDetails{
        uint roomId;
        uint price;
    }
    enum RoomStatus { Available, Occupied }
    RoomStatus[] rooms;
    uint roomCount;
    mapping(uint => roomDetails) roomMap;
    mapping(address => uint) roomBookings;
    mapping(uint => address) checkIns;
    mapping(uint => address) checkOuts;
    mapping(uint => address[]) waitLists;

    event CheckIn(address customer, uint roomNumber);
    event CheckOut(address customer, uint roomNumber);
    event RoomBooked(uint roomNumber);
    event RoomCanceled(uint roomNumber);
    event RoomReassigned(uint roomNumber);

    constructor() ERC721("HHToken", "HHT") {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    modifier onlyValidRoom(uint roomNumber) {
        require(roomNumber < rooms.length);
        _;
    }

    modifier isBooked(uint roomNumber) {
        require(roomBookings[msg.sender] == roomNumber);
        _;
    }

    function addRoom(uint256 price) public onlyOwner{
        roomMap[roomCount] = roomDetails(roomCount,price);
        rooms.push(RoomStatus.Available);
        _safeMint(owner, roomCount);
        roomCount = roomCount+1;
    }

    function bookHotelRoom(uint256 roomNumber) public payable onlyValidRoom(roomNumber) {
        RoomStatus status = rooms[roomNumber];
        if(status != RoomStatus.Available){
            revert();
        }
        rooms[roomNumber] = RoomStatus.Occupied;
        roomBookings[msg.sender] = roomNumber;
        waitLists[roomNumber].push(msg.sender);
        owner.transfer(msg.value);
        emit RoomBooked(roomNumber);
    }

    function cancelHotelBooking(uint256 roomNumber) public onlyValidRoom(roomNumber) isBooked(roomNumber) {
            RoomStatus room = rooms[roomNumber];
            if(room == RoomStatus.Occupied){
                rooms[roomNumber] = RoomStatus.Available;
                delete roomBookings[msg.sender];
            }
            else{
                revert();
            }
        emit RoomCanceled(roomNumber);
    }

    function getRoomsAvailable() public view returns(uint) {
        uint i=0;
        uint count = 0;
        for(i = 0;i<roomCount;i++){
            if (rooms[i] == RoomStatus.Available){
                count += 1;
            }
        }
        return count;
    }

    function hotelCheckIn(uint256 roomNumber) public onlyValidRoom(roomNumber) isBooked(roomNumber) {
        RoomStatus room = rooms[roomNumber];
        if(room != RoomStatus.Occupied){
            checkIns[roomNumber] = msg.sender;
        }
        emit CheckIn(msg.sender, roomNumber);
    }

    function hotelCheckOut(uint256 roomNumber) public onlyValidRoom(roomNumber) {
        require(rooms[roomNumber] == RoomStatus.Occupied);
        checkOuts[roomNumber] = msg.sender;
        address[] memory waitList = waitLists[roomNumber];
        if (waitList.length > 0) {
            address newCustomer = waitList[0];
            checkIns[roomNumber] = newCustomer;
            checkOuts[roomNumber] = newCustomer;
            waitLists[roomNumber][0] = address(0);
            emit RoomReassigned(roomNumber);
        }
        rooms[roomNumber] = RoomStatus.Available;
        delete checkIns[roomNumber];
        delete checkOuts[roomNumber];
        emit CheckOut(msg.sender, roomNumber);
    }

    function appreciation(uint256 roomNumber) onlyValidRoom(roomNumber) onlyOwner public{
        roomMap[roomNumber].price += roomMap[roomNumber].price * 5 / 100;
    }

    function depreciation(uint256 roomNumber) onlyValidRoom(roomNumber) onlyOwner public {
        roomMap[roomNumber].price -= roomMap[roomNumber].price * 5 / 100;
    }
}