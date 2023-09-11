import Assets from '../assets';
import { tokenStore, assets as tokenAssets, DefaultTokens, WETHByChainId, ITokenObject, ChainNativeTokenByChainId } from '@scom/scom-token-list';
import { LockTokenType } from '../global/index';
import { application } from '@ijstech/components';

export const fallBackUrl = Assets.fullPath('img/tokens/token-placeholder.svg');

export const getChainNativeToken = (chainId: number): ITokenObject => {
  return ChainNativeTokenByChainId[chainId];
}

export const getNetworkInfo = (chainId: number) => {
  const networkMap = application.store['networkMap'];
  return networkMap[chainId];
}

export const viewOnExplorerByAddress = (chainId: number, address: string) => {
  let network = getNetworkInfo(chainId);
  if (network && network.explorerAddressUrl) {
    let url = `${network.explorerAddressUrl}${address}`;
    window.open(url);
  }
}

export const tokenSymbol = (chainId: number, address: string) => {
  if (!address) return '';
  const tokenMap = tokenStore.getTokenMapByChainId(chainId);
  let tokenObject = tokenMap[address.toLowerCase()];
  if (!tokenObject) {
    tokenObject = tokenMap[address];
  }
  return tokenObject ? tokenObject.symbol : '';
}

// staking common
export const getLockedTokenObject = (info: any, tokenInfo: any, tokenMap: any) => {
  if (info) {
    if (info.lockTokenType == LockTokenType.ERC20_Token) {
      return tokenMap[tokenInfo.tokenAddress];
    }
    if (info.lockTokenType == LockTokenType.LP_Token && tokenInfo.lpToken) {
      return tokenInfo.lpToken.object;
    }
    else if (info.lockTokenType == LockTokenType.VAULT_Token && tokenInfo.vaultToken) {
      return tokenInfo.vaultToken.object;
    }
  }
  return null;
}

export const getLockedTokenSymbol = (info: any, token: any) => {
  if (info) {
    if (info.lockTokenType == LockTokenType.ERC20_Token) {
      return token ? token.symbol : '';
    }
    if (info.lockTokenType == LockTokenType.LP_Token) {
      return 'LP';
    }
    if (info.lockTokenType == LockTokenType.VAULT_Token) {
      return token ? `vt${token.assetToken.symbol}` : '';
    }
  }
  return '';
}

export const getLockedTokenIconPaths = (info: any, tokenObject: any, chainId: number, tokenMap?: any) => {
  if (info && tokenObject) {
    if (!tokenMap) {
      tokenMap = tokenStore.getTokenMapByChainId(chainId);
    }
    if (info.lockTokenType == LockTokenType.ERC20_Token) {
      return [tokenAssets.getTokenIconPath(tokenObject, chainId)];
    }
    if (info.lockTokenType == LockTokenType.LP_Token) {
      const nativeToken = DefaultTokens[chainId]?.find((token) => token.isNative);
      const token0 = tokenMap[tokenObject.token0] || nativeToken;
      const token1 = tokenMap[tokenObject.token1] || nativeToken;
      return [tokenAssets.getTokenIconPath(token0, chainId), tokenAssets.getTokenIconPath(token1, chainId)];
    }
    if (info.lockTokenType == LockTokenType.VAULT_Token) {
      return [tokenAssets.getTokenIconPath(tokenObject.assetToken, chainId)];
    }
  }
  return [];
}

export const getTokenDecimals = (address: string, chainId: number) => {
  const ChainNativeToken = getChainNativeToken(chainId);
  const tokenMap = tokenStore.getTokenMapByChainId(chainId);
  const tokenObject = (!address || address.toLowerCase() === WETHByChainId[chainId].address.toLowerCase()) ? ChainNativeToken : tokenMap[address.toLowerCase()];
  return tokenObject ? tokenObject.decimals : 18;
}

export const baseUrl = 'https://openswap.xyz/#';

export const getTokenUrl = `${baseUrl}/swap`;
export const maxWidth = '690px';
export const maxHeight = 321;

export * from './utils';
