import { INetwork } from '../../global/index';
const InfuraId = "adc596bf88b648e2a8902bc9093930c5"
const Networks: { [key: number]: INetwork } = {
  1: {
    chainId: 1,
    name: "Ethereum",
    label: "Ethereum",
    icon: "ethereumNetwork.svg",
    rpc: `https://mainnet.infura.io/v3/${InfuraId}`,
    explorerName: "Etherscan"
  },
  25: {
    chainId: 25,
    name: "Cronos",
    label: "Cronos Mainnet",
    icon: "cronosMainnet.svg", //notadded,
    isDisabled: true
  },
  56: {
    chainId: 56,
    name: "Binance",
    label: "Binance Smart Chain",
    icon: "bscMainnet.svg",
    rpc: 'https://bsc-dataseed.binance.org/',
    explorerName: "BSCScan"
  },
  137: {
    label: 'Polygon',
    name: 'Polygon',
    chainId: 137,
    icon: 'polygon.svg',
    explorerName: 'PolygonScan'
  },
  250: {
    label: 'Fantom Opera',
    name: 'Fantom',
    chainId: 250,
    icon: 'fantom-ftm-logo.svg',
    rpc: 'https://rpc.ftm.tools/',
    explorerName: 'FTMScan'
  },
  97: {
    label: 'BSC Testnet',
    name: 'BSC Testnet',
    chainId: 97,
    icon: 'bscMainnet.svg',
    rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    explorerName: 'BSCScan'
  },
  338: {
    label: 'Cronos Testnet',
    name: 'Cronos Testnet',
    chainId: 338,
    icon: 'cronosTestnet.svg', //not added
    isDisabled: true
  },
  31337: {
    chainId: 31337,
    name: "Amino",
    label: 'Amino Testnet',
    icon: 'animoTestnet.svg',
    isDisabled: true
  },
  80001: {
    chainId: 80001,
    name: "Mumbai",
    label: 'Mumbai',
    icon: 'polygon.svg',
    rpc: 'https://matic-mumbai.chainstacklabs.com',
    explorerName: 'PolygonScan'
  },
  43113: {
    chainId: 43113,
    name: "Fuji",
    label: 'Avalanche FUJI C-Chain',
    icon: 'avax.svg',
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerName: 'SnowTrace'
  },
  43114: {
    chainId: 43114,
    name: "Avalanche",
    label: 'Avalanche Mainnet C-Chain',
    icon: 'avax.svg',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    explorerName: 'SnowTrace'
  },
  4002: {
    chainId: 4002,
    name: "Fantom Testnet",
    label: 'Fantom Testnet',
    icon: 'fantom-ftm-logo.svg',
    rpc: 'https://rpc.testnet.fantom.network/',
    isDisabled: true,
    explorerName: 'FTMScan'
  },
  13370: {
    chainId: 13370,
    name: 'AminoX Testnet',
    label: 'AminoX Testnet',
    icon: 'aminoXTestnet.svg',
    isDisabled: true,
    explorerName: 'AminoX Explorer'
  },
  421613: {
    chainId: 421613,
    explorerName: 'ArbiScan',
    name: 'Arbitrum Testnet',
    label: 'Arbitrum Testnet',
    icon: 'arbitrum.svg'
  }
}
const Mainnets = {
  binance: Networks[56],
  ethereum: Networks[1],
  avalanche: Networks[43114],
  cronos: Networks[25],
  fantom: Networks[250],
  polygon: Networks[137]
};
const Testnets = {
  binance: Networks[97],
  cronos: Networks[338],
  avalanche: Networks[43113],
  fantom: Networks[4002],
  polygon: Networks[80001],
  aminox: Networks[13370],
  arbitrum: Networks[421613]
};

enum ChainNetwork {
  BSCMainnet = 56,
  BSCTestnet = 97,
  EthMainnet = 1,
  Polygon = 137,
  AminoTestnet = 31337,
  Mumbai = 80001,
  Fuji = 43113,
  Avalanche = 43114,
  Fantom = 250,
  FantomTestnet = 4002,
  CronosMainnet = 25,
  CronosTestnet = 338,
  AminoXTestnet = 13370,
  Arbitrum = 421613
}

const listNetworks = [
  {
    label: 'Binance Smart Chain',
    value: 'binance',
    chainId: ChainNetwork.BSCMainnet,
    img: 'bscMainnet.svg'
  },
  {
    label: 'BSC Testnet',
    value: 'testnet',
    chainId: ChainNetwork.BSCTestnet,
    img: 'bscMainnet.svg'
  },
  {
    label: 'Ethereum',
    value: 'ethereum',
    chainId: ChainNetwork.EthMainnet,
    img: 'ethereumNetwork.svg'
  },
  {
    label: 'Amino Testnet',
    value: 'amino',
    chainId: ChainNetwork.AminoTestnet,
    img: 'animoTestnet.svg'
  },
  {
    label: 'Avalanche Mainnet C-Chain',
    value: 'avalanche',
    chainId: ChainNetwork.Avalanche,
    img: 'avax.svg'
  },
  {
    label: 'Avalanche FUJI C-Chain',
    value: 'fuji',
    chainId: ChainNetwork.Fuji,
    img: 'avax.svg'
  },
  {
    label: 'Polygon',
    value: 'polygon',
    chainId: ChainNetwork.Polygon,
    img: 'polygon.svg'
  },
  {
    label: 'Mumbai',
    value: 'mumbai',
    chainId: ChainNetwork.Mumbai,
    img: 'polygon.svg'
  },
  {
    label: 'Fantom Opera',
    value: 'fantom',
    chainId: ChainNetwork.Fantom,
    img: 'fantom-ftm-logo.svg'
  },
  {
    label: 'Fantom Testnet',
    value: 'fantomTestnet',
    chainId: ChainNetwork.FantomTestnet,
    img: 'fantom-ftm-logo.svg'
  },
  {
    label: 'Cronos Mainnet',
    value: 'Cronos',
    chainId: ChainNetwork.CronosMainnet,
    img: 'cronosMainnet.svg'
  },
  {
    label: 'Cronos Testnet',
    value: 'cronosTestnet',
    chainId: ChainNetwork.CronosTestnet,
    img: 'cronosTestnet.svg'
  },
  {
    label: 'AminoX Testnet',
    value: 'aminoXTestnet',
    chainId: ChainNetwork.AminoXTestnet,
    img: 'aminoXTestnet.svg'
  },
  {
    label: 'Arbitrum Testnet',
    value: 'arbitrumTestnet',
    chainId: ChainNetwork.Arbitrum,
    img: 'arbitrum.svg'
  },
];


export {
  InfuraId,
  Networks,
  Mainnets,
  Testnets,
  ChainNetwork,
  listNetworks,
}