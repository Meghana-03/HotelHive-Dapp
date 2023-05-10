App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:7545',
  address: '0xe6474167b066e53a4A588eDa40692Bb23e73e55B',
  network_id: 5777,
  chairPerson: null,
  currentAccount: null,
  index: 0,
  margin: 10,
  left: 15,
  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      App.web3 = new Web3(Web3.givenProvider);
    } else {
      App.web3 = new Web3(App.url);
    }
    ethereum.request({ method: "eth_requestAccounts" });
    App.populateAddress();
    App.getRoomsAvailable();
    return App.initContract();
  },

  initContract: function () {
    $.getJSON('HHT.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      App.contracts.HHT = new App.web3.eth.Contract(App.abi, App.address, {});
      return App.bindEvents();
    });
  },

  bindEvents: function () {
    $(document).on('click', '#add_room', function () {
      App.addRoom(jQuery('#room_price').val());
    });
    $(document).on("click", "#book_room", function () {
      App.handleBookRoom(jQuery("#book_cancel_room_id").val());
    });
    $(document).on("click", "#cancel_room", function () {
      App.handleCancelRoom(jQuery("#book_cancel_room_id").val());
    });
    $(document).on("click", "#checkin_room", function () {
      App.handleCheckIn(jQuery("#checkin_checkout_room_id").val());
    });
    $(document).on("click", "#checkout_room", function () {
      App.handleCheckOut(jQuery("#checkin_checkout_room_id").val());
    });
    $(document).on("click", "#appreciate_room", function () {
      App.handleAppreciate(jQuery("#review_room_id").val());
    });
    $(document).on("click", "#depreciate_room", function () {
      App.handleDepreciate(jQuery("#review_room_id").val());
    });
    App.populateAddress();
    App.getRoomsAvailable();
  },

  addRoom: function (price) {
    if (price === "" || price<=0) {
      toastr.error("Please enter a valid price", "Reverted!");
      return false;
    }
    var option = { from: App.handler };
    App.contracts.HHT.methods
      .addRoom(price)
      .send(option)
      .on("receipt", (receipt) => {
        location.reload();
        toastr.success("Success! The room is added successfully");
      })
      .on("error", (err) => {
        toastr.error(App.getErrorMessage(err), "Reverted!");
      });
  },

  populateAddress: async function () {
    const userAccounts = await App.web3.eth.getAccounts();
    App.handler = userAccounts[0];
    document.getElementById("currentUserAddress").innerText =
      "Current User Address: " + App.handler;
  },

  myOnChangeFunction: function () {
    // get the dropdown element
    console.log("In function");
    const myDropdown = document.getElementById("myDropdown");
    const selectedOption = myDropdown.options[myDropdown.selectedIndex];
    const selectedValue = selectedOption.value;
    console.log(selectedValue);
    alert("You selected " + selectedValue);
  },

  getRoomsAvailable: async function () {
    var option = { from: App.handler };
    console.log("Etered");
    App.contracts.HHT.methods
      .getRoomsAvailable()
      .call(option)
      .then(function(res){
        document.getElementById("roomsAvailable").innerText =
          "Number of Rooms Available: " + res;
      })
      .catch(function(error) {
        console.log(error);
      });
  },

  handleBookRoom: function (roomNumber) {
    if (roomNumber === "") {
      toastr.error("Please enter a valid room number.", "Reverted!");
      return false;
    }
    var option = { from: App.handler };
    App.contracts.HHT.methods
      .bookHotelRoom(roomNumber)
      .send(option)
      .on("receipt", (receipt) => {
        location.reload();
        toastr.success("Success! The room number " + roomNumber + " is booked successfully");
      })
      .on("error", (err) => {
        toastr.error(App.getErrorMessage(err), "Reverted!");
      });
  },

  handleCancelRoom: function (roomNumber) {
    if (roomNumber === "") {
      toastr.error("Please enter a valid room number.", "Reverted!");
      return false;
    }
    var option = { from: App.handler };
    App.contracts.HHT.methods
      .cancelHotelBooking(roomNumber)
      .send(option)
      .on("receipt", (receipt) => {
        location.reload();
        toastr.success("Success! The room number " + roomNumber + " is cancelled successfully");
      })
      .on("error", (err) => {
        toastr.error(App.getErrorMessage(err), "Reverted!");
      });
  },

  handleCheckIn: function (roomNumber) {
    if (roomNumber === "") {
      toastr.error("Please enter a valid room number.", "Reverted!");
      return false;
    }
    var option = { from: App.handler };
    App.contracts.HHT.methods
      .hotelCheckIn(roomNumber)
      .send(option)
      .on("receipt", (receipt) => {
        location.reload();
        toastr.success("Success! The room number " + roomNumber + " is Checked-In successfully");
      })
      .on("error", (err) => {
        toastr.error(App.getErrorMessage(err), "Reverted!");
      });
  },

  handleCheckOut: function (roomNumber) {
    if (roomNumber === "") {
      toastr.error("Please enter a valid room number.", "Reverted!");
      return false;
    }
    var option = { from: App.handler };
    App.contracts.HHT.methods
      .hotelCheckOut(roomNumber)
      .send(option)
      .on("receipt", (receipt) => {
        location.reload();
        toastr.success("Success! The room number " + roomNumber + " is Checked-Out successfully");
      })
      .on("error", (err) => {
        toastr.error(App.getErrorMessage(err), "Reverted!");
      });
  },

  handleAppreciate: function (roomNumber) {
    if (roomNumber === "") {
      toastr.error("Please enter a valid room number.", "Reverted!");
      return false;
    }
    var option = { from: App.handler };
    App.contracts.HHT.methods
      .appreciation(roomNumber)
      .send(option)
      .on("receipt", (receipt) => {
        toastr.success("Success! The room number " + roomNumber + " is appreciated successfully");
      })
      .on("error", (err) => {
        toastr.error(App.getErrorMessage(err), "Reverted!");
      });
  },

  handleDepreciate: function (roomNumber) {
    if (roomNumber === "") {
      toastr.error("Please enter a valid room number.", "Reverted!");
      return false;
    }
    var option = { from: App.handler };
    App.contracts.HHT.methods
      .depreciation(roomNumber)
      .send(option)
      .on("receipt", (receipt) => {
        toastr.success("Success! The room number " + roomNumber + " is depreciated successfully");
      })
      .on("error", (err) => {
        toastr.error(App.getErrorMessage(err), "Reverted!");
      });
  },

  getErrorMessage: function (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    let errorReason = "";
    if (errorCode === 4001) {
      return "User rejected the request!";
    } else if (
      errorMessage.includes("Access Denied: user is not the contract deployer!")
    ) {
      return "Access Denied: The address calling this function is not the deployer!";
    } else {
      return "Unexpected Error!";
    }
  },

  abi: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "addRoom",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRoomsAvailable",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "numberOfRooms",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roomNumber",
          "type": "uint256"
        }
      ],
      "name": "bookHotelRoom",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roomNumber",
          "type": "uint256"
        }
      ],
      "name": "cancelHotelBooking",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roomNumber",
          "type": "uint256"
        }
      ],
      "name": "hotelCheckIn",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roomNumber",
          "type": "uint256"
        }
      ],
      "name": "hotelCheckOut",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roomNumber",
          "type": "uint256"
        }
      ],
      "name": "appreciation",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roomNumber",
          "type": "uint256"
        }
      ],
      "name": "depreciation",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ],
};

$(function () {
  $(window).load(function () {
    App.init();
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: "toast-bottom-full-width",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "5000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
  });
});

/* Detect when the account on metamask is changed */
window.ethereum.on("accountsChanged", () => {
  App.populateAddress();
  App.getRoomsAvailable();
});

/* Detect when the network on metamask is changed */
window.ethereum.on("chainChanged", () => {
  App.populateAddress();
  App.getRoomsAvailable();
});
