import { INetwork } from '../../global/index';
const InfuraId = 'adc596bf88b648e2a8902bc9093930c5';

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

const Networks: { [key: number]: INetwork } = {
  1: {
    chainId: ChainNetwork.EthMainnet,
    name: "Ethereum",
    label: "Ethereum",
    value: "Ethereum",
    icon: "ethereumNetwork.svg",
    rpc: `https://mainnet.infura.io/v3/${InfuraId}`,
    explorerName: "Etherscan",
    isDisabled: true
  },
  25: {
    chainId: ChainNetwork.CronosMainnet,
    name: "Cronos Mainnet",
    value: "Cronos",
    label: "Cronos Mainnet",
    icon: "cronosMainnet.svg", //notadded,
    isDisabled: true
  },
  56: {
    chainId: ChainNetwork.BSCMainnet,
    name: "Binance Smart Chain",
    value: "Binance",
    label: "Binance Smart Chain",
    icon: "bscMainnet.svg",
    rpc: 'https://bsc-dataseed.binance.org/',
    explorerName: "BSCScan",
    isDisabled: true
  },
  137: {
    label: 'Polygon',
    name: 'Polygon',
    value: 'Polygon',
    chainId: ChainNetwork.Polygon,
    icon: 'polygon.svg',
    explorerName: 'PolygonScan',
    isDisabled: true
  },
  250: {
    label: 'Fantom Opera',
    name: 'Fantom Opera',
    value: 'Fantom',
    chainId: ChainNetwork.Fantom,
    icon: 'fantom-ftm-logo.svg',
    rpc: 'https://rpc.ftm.tools/',
    explorerName: 'FTMScan',
    isDisabled: true
  },
  97: {
    label: 'BSC Testnet',
    name: 'BSC Testnet',
    value: 'BSCTestnet',
    chainId: ChainNetwork.BSCTestnet,
    icon: 'bscMainnet.svg',
    rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    explorerName: 'BSCScan'
  },
  338: {
    label: 'Cronos Testnet',
    name: 'Cronos Testnet',
    value: 'CronosTestnet',
    chainId: ChainNetwork.CronosTestnet,
    icon: 'cronosTestnet.svg', //not added
    isDisabled: true
  },
  31337: {
    chainId: ChainNetwork.AminoTestnet,
    name: 'Amino',
    label: 'Amino Testnet',
    value: 'AminoTestnet',
    icon: 'animoTestnet.svg',
    isDisabled: true
  },
  80001: {
    chainId: ChainNetwork.Mumbai,
    name: "Mumbai",
    label: 'Mumbai',
    value: 'Mumbai',
    icon: 'polygon.svg',
    rpc: 'https://matic-mumbai.chainstacklabs.com',
    explorerName: 'PolygonScan',
    isDisabled: true
  },
  43113: {
    chainId: ChainNetwork.Fuji,
    name: "Avalanche FUJI C-Chain",
    label: 'Avalanche FUJI C-Chain',
    value: 'Fuji',
    icon: 'avax.svg',
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerName: 'SnowTrace'
  },
  43114: {
    chainId: ChainNetwork.Avalanche,
    name: 'Avalanche Mainnet C-Chain',
    label: 'Avalanche Mainnet C-Chain',
    value: 'Avalanche',
    icon: 'avax.svg',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    explorerName: 'SnowTrace',
    isDisabled: true
  },
  4002: {
    chainId: ChainNetwork.FantomTestnet,
    name: 'Fantom Testnet',
    label: 'Fantom Testnet',
    value: 'FantomTestnet',
    icon: 'fantom-ftm-logo.svg',
    rpc: 'https://rpc.testnet.fantom.network/',
    isDisabled: true,
    explorerName: 'FTMScan'
  },
  13370: {
    chainId: ChainNetwork.AminoXTestnet,
    name: 'AminoX Testnet',
    label: 'AminoX Testnet',
    value: 'AminoXTestnet',
    icon: 'aminoXTestnet.svg',
    isDisabled: true,
    explorerName: 'AminoX Explorer'
  },
  421613: {
    chainId: ChainNetwork.Arbitrum,
    explorerName: 'ArbiScan',
    name: 'Arbitrum Testnet',
    label: 'Arbitrum Testnet',
    value: 'Arbitrum',
    icon: 'arbitrum.svg',
    isDisabled: true
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

const SupportedNetworks: INetwork[] = Object.values(Networks).filter(network => !network.isDisabled);

export {
  InfuraId,
  Networks,
  Mainnets,
  Testnets,
  ChainNetwork,
  SupportedNetworks
}