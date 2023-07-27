import { INetwork, Wallet } from '@ijstech/eth-wallet';
import { EventId } from '../global/index';
import { ChainNativeTokenByChainId, ITokenObject } from '@scom/scom-token-list';
import getNetworkList from '@scom/scom-network-list';
import { application } from '@ijstech/components';

export * from './data/index';

const setInfuraId = (infuraId: string) => {
  state.infuraId = infuraId;
}

export const getInfuraId = () => {
  return state.infuraId;
}

const setNetworkList = (networkList: INetwork[], infuraId?: string) => {
  const wallet = Wallet.getClientInstance();
  state.networkMap = {};
  const defaultNetworkList = getNetworkList();
  const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
    acc[cur.chainId] = cur;
    return acc;
  }, {});
  for (let network of networkList) {
    const networkInfo = defaultNetworkMap[network.chainId];
    if (!networkInfo) continue;
    if (infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
      for (let i = 0; i < network.rpcUrls.length; i++) {
        network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, infuraId);
      }
    }
    state.networkMap[network.chainId] = {
      ...networkInfo,
      ...network
    };
    wallet.setNetworkInfo(state.networkMap[network.chainId]);
  }
}

export const getChainNativeToken = (chainId: number): ITokenObject => {
  return ChainNativeTokenByChainId[chainId];
};

export const setDataFromConfig = (options: any) => {
  if (options.infuraId) {
    setInfuraId(options.infuraId)
  }
  if (options.networks) {
    setNetworkList(options.networks, options.infuraId)
  }
  if (options.proxyAddresses) {
    setProxyAddresses(options.proxyAddresses)
  }
  if (options.embedderCommissionFee) {
    setEmbedderCommissionFee(options.embedderCommissionFee);
  }
}

export type ProxyAddresses = { [key: number]: string };

export const state = {
  networkMap: {} as { [key: number]: INetwork },
  infuraId: '',
  stakingStatusMap: {} as { [key: string]: { value: boolean, text: string } },
  proxyAddresses: {} as ProxyAddresses,
  embedderCommissionFee: '0',
  rpcWalletId: ''
}

export const setStakingStatus = (key: string, value: boolean, text: string) => {
  state.stakingStatusMap[key] = { value, text };
  application.EventBus.dispatch(EventId.EmitButtonStatus, { key, value, text });
}

export const getStakingStatus = (key: string) => {
  return state.stakingStatusMap[key] || { value: false, text: 'Stake' };
}

export const setProxyAddresses = (data: ProxyAddresses) => {
  state.proxyAddresses = data;
}

export const getProxyAddress = (chainId?: number) => {
  const _chainId = chainId || Wallet.getInstance().chainId;
  const proxyAddresses = state.proxyAddresses;
  if (proxyAddresses) {
    return proxyAddresses[_chainId];
  }
  return null;
}

const setEmbedderCommissionFee = (fee: string) => {
  state.embedderCommissionFee = fee;
}

export const getEmbedderCommissionFee = () => {
  return state.embedderCommissionFee;
}

export const getNetworkInfo = (chainId: number) => {
  const networkMap = application.store["networkMap"];
  return networkMap[chainId];
}

export const viewOnExplorerByAddress = (chainId: number, address: string) => {
  let network = getNetworkInfo(chainId);
  if (network && network.explorerAddressUrl) {
    let url = `${network.explorerAddressUrl}${address}`;
    window.open(url);
  }
}

export function isClientWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}

export function isRpcWalletConnected() {
  const wallet = getRpcWallet();
  return wallet?.isConnected;
}

export function getChainId() {
  const rpcWallet = getRpcWallet();
  return rpcWallet?.chainId;
}

export function initRpcWallet(defaultChainId: number) {
  if (state.rpcWalletId) {
    return state.rpcWalletId;
  }
  const clientWallet = Wallet.getClientInstance();
  const networkList: INetwork[] = Object.values(application.store.networkMap);
  const instanceId = clientWallet.initRpcWallet({
    networks: networkList,
    defaultChainId,
    infuraId: application.store.infuraId,
    multicalls: application.store.multicalls
  });
  state.rpcWalletId = instanceId;
  if (clientWallet.address) {
    const rpcWallet = Wallet.getRpcWalletInstance(instanceId);
    rpcWallet.address = clientWallet.address;
  }
  return instanceId;
}

export function getRpcWallet() {
  return Wallet.getRpcWalletInstance(state.rpcWalletId);
}

export function getClientWallet() {
  return Wallet.getClientInstance();
}