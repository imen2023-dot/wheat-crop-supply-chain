const CONTRACT_ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "silos",
    "outputs": [
      {
        "components": [
          {
            "name": "mail",
            "type": "string"
          },
          {
            "name": "password",
            "type": "string"
          },
          {
            "name": "account",
            "type": "address"
          },
          {
            "name": "cid",
            "type": "string"
          },
          {
            "name": "role",
            "type": "string"
          },
          {
            "name": "status",
            "type": "string"
          }
        ],
        "name": "user",
        "type": "tuple"
      },
      {
        "name": "location",
        "type": "string"
      },
      {
        "name": "capacity",
        "type": "uint32"
      },
      {
        "name": "quantity",
        "type": "uint32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "farmers",
    "outputs": [
      {
        "components": [
          {
            "name": "mail",
            "type": "string"
          },
          {
            "name": "password",
            "type": "string"
          },
          {
            "name": "account",
            "type": "address"
          },
          {
            "name": "cid",
            "type": "string"
          },
          {
            "name": "role",
            "type": "string"
          },
          {
            "name": "status",
            "type": "string"
          }
        ],
        "name": "user",
        "type": "tuple"
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "number",
        "type": "uint32"
      },
      {
        "name": "location",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "transportations",
    "outputs": [
      {
        "name": "farmer",
        "type": "address"
      },
      {
        "name": "transporter",
        "type": "address"
      },
      {
        "name": "silo",
        "type": "address"
      },
      {
        "name": "isRated",
        "type": "bool"
      },
      {
        "name": "weight",
        "type": "uint32"
      },
      {
        "name": "status",
        "type": "string"
      },
      {
        "name": "date",
        "type": "string"
      },
      {
        "name": "pickUpDate",
        "type": "string"
      },
      {
        "name": "deliviredDate",
        "type": "string"
      },
      {
        "name": "ssiHash",
        "type": "string"
      },
      {
        "name": "rating",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "transporters",
    "outputs": [
      {
        "components": [
          {
            "name": "mail",
            "type": "string"
          },
          {
            "name": "password",
            "type": "string"
          },
          {
            "name": "account",
            "type": "address"
          },
          {
            "name": "cid",
            "type": "string"
          },
          {
            "name": "role",
            "type": "string"
          },
          {
            "name": "status",
            "type": "string"
          }
        ],
        "name": "user",
        "type": "tuple"
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "licensePlate",
        "type": "string"
      },
      {
        "name": "carCapacity",
        "type": "uint32"
      },
      {
        "name": "location",
        "type": "string"
      },
      {
        "name": "rating",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "Address",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "role",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "mail",
        "type": "string"
      }
    ],
    "name": "UserAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "message",
        "type": "string"
      }
    ],
    "name": "emettedEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "message",
        "type": "string"
      }
    ],
    "name": "ResponseMessage",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "email",
        "type": "string"
      },
      {
        "name": "pass",
        "type": "string"
      }
    ],
    "name": "verify",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "name": "mail",
                "type": "string"
              },
              {
                "name": "password",
                "type": "string"
              },
              {
                "name": "account",
                "type": "address"
              },
              {
                "name": "cid",
                "type": "string"
              },
              {
                "name": "role",
                "type": "string"
              },
              {
                "name": "status",
                "type": "string"
              }
            ],
            "name": "user",
            "type": "tuple"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "number",
            "type": "uint32"
          },
          {
            "name": "location",
            "type": "string"
          },
          {
            "name": "transportations",
            "type": "uint256[]"
          }
        ],
        "name": "farmer",
        "type": "tuple[]"
      }
    ],
    "name": "addFarmers",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "name": "mail",
                "type": "string"
              },
              {
                "name": "password",
                "type": "string"
              },
              {
                "name": "account",
                "type": "address"
              },
              {
                "name": "cid",
                "type": "string"
              },
              {
                "name": "role",
                "type": "string"
              },
              {
                "name": "status",
                "type": "string"
              }
            ],
            "name": "user",
            "type": "tuple"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "licensePlate",
            "type": "string"
          },
          {
            "name": "carCapacity",
            "type": "uint32"
          },
          {
            "name": "location",
            "type": "string"
          },
          {
            "name": "transportations",
            "type": "uint256[]"
          },
          {
            "name": "rating",
            "type": "uint8"
          }
        ],
        "name": "transporter",
        "type": "tuple[]"
      }
    ],
    "name": "addTransporters",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "name": "mail",
                "type": "string"
              },
              {
                "name": "password",
                "type": "string"
              },
              {
                "name": "account",
                "type": "address"
              },
              {
                "name": "cid",
                "type": "string"
              },
              {
                "name": "role",
                "type": "string"
              },
              {
                "name": "status",
                "type": "string"
              }
            ],
            "name": "user",
            "type": "tuple"
          },
          {
            "name": "location",
            "type": "string"
          },
          {
            "name": "capacity",
            "type": "uint32"
          },
          {
            "name": "quantity",
            "type": "uint32"
          },
          {
            "name": "transportations",
            "type": "uint256[]"
          }
        ],
        "name": "silo",
        "type": "tuple[]"
      }
    ],
    "name": "addSilos",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getFarmers",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getTransporters",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getSilos",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "cid",
        "type": "string"
      },
      {
        "name": "role",
        "type": "string"
      }
    ],
    "name": "addCid",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newPassword",
        "type": "string"
      },
      {
        "name": "oldPassword",
        "type": "string"
      },
      {
        "name": "role",
        "type": "string"
      }
    ],
    "name": "changePassword",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "status",
        "type": "string"
      },
      {
        "name": "role",
        "type": "string"
      },
      {
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "changeStatus",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "components": [
          {
            "name": "farmer",
            "type": "address"
          },
          {
            "name": "transporter",
            "type": "address"
          },
          {
            "name": "silo",
            "type": "address"
          },
          {
            "name": "isRated",
            "type": "bool"
          },
          {
            "name": "weight",
            "type": "uint32"
          },
          {
            "name": "status",
            "type": "string"
          },
          {
            "name": "date",
            "type": "string"
          },
          {
            "name": "pickUpDate",
            "type": "string"
          },
          {
            "name": "deliviredDate",
            "type": "string"
          },
          {
            "name": "ssiHash",
            "type": "string"
          },
          {
            "name": "rating",
            "type": "uint8"
          }
        ],
        "name": "transportation",
        "type": "tuple"
      }
    ],
    "name": "addTransportation",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "status",
        "type": "string"
      },
      {
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "changeTransportationStatus",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "hash",
        "type": "string"
      },
      {
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "transportationHash",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "rating",
        "type": "uint8"
      },
      {
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "rateTransportation",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "farmerAddress",
        "type": "address"
      }
    ],
    "name": "getFarmerTransportations",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "transporterAddress",
        "type": "address"
      }
    ],
    "name": "getTransporterTransportations",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "siloAddress",
        "type": "address"
      }
    ],
    "name": "getSiloTransportations",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "date",
        "type": "string"
      },
      {
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "pickYield",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "date",
        "type": "string"
      },
      {
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "transportYield",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];


  export default CONTRACT_ABI;
