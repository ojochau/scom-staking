export default {
  "infuraId": "adc596bf88b648e2a8902bc9093930c5",
  "networks": [  
    {
      "chainId": 97,
      "isMainChain": true,
      "isCrossChainSupported": true,
      "explorerName": "BSCScan",
      "explorerTxUrl": "https://testnet.bscscan.com/tx/",
      "explorerAddressUrl": "https://testnet.bscscan.com/address/",
      "isTestnet": true
    },    
    {
      "chainId": 43113,
      "shortName": "AVAX Testnet",
      "isCrossChainSupported": true,
      "explorerName": "SnowTrace",
      "explorerTxUrl": "https://testnet.snowtrace.io/tx/",
      "explorerAddressUrl": "https://testnet.snowtrace.io/address/",
      "isTestnet": true
    }    
  ],
  "proxyAddresses": {
    "97": "0x9602cB9A782babc72b1b6C96E050273F631a6870",
    "43113": "0x7f1EAB0db83c02263539E3bFf99b638E61916B96"
  },
  "ipfsGatewayUrl": "https://ipfs.scom.dev/ipfs/",
  "embedderCommissionFee": "0.01",
  "defaultBuilderData": {
    "defaultChainId": 43113,
    "chainId": 43113,
    "customName": "Scom-Staking",
    "customDesc": "Earn OSWAP",
    "showContractLink": true,
    "stakings": {
      "address": "0x03C22D12eb6E5ea3a06F46Fc0e1857438BB7DCae",
      "lockTokenType": 0,
      "rewards": {
        "address": "0x10B846B7A1807B3610ee94c1b120D9c5E87C148d",
        "isCommonStartDate": false
      }
    },
    "networks": [
      {
        "chainId": 43113
      },
      {
        "chainId": 97
      }
    ],
    "wallets": [
      {
        "name": "metamask"
      }
    ]
  }
}