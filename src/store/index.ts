import Assets from '../assets';
import { DefaultTokens, LockTokenType, getTokenIconPath } from './data/index';
import { tokenStore } from '@scom/scom-token-list';
import { getAddresses, getChainId, getChainNativeToken, isWalletConnected } from './utils';

export const fallBackUrl = Assets.fullPath('img/tokens/token-placeholder.svg');

export const getTokenIcon = (address: string) => {
  if (!address) return '';
  const tokenMap = tokenStore.tokenMap;
  let ChainNativeToken;
  let tokenObject;
  if (isWalletConnected()){
    ChainNativeToken = getChainNativeToken(getChainId());
    tokenObject = address == ChainNativeToken.symbol ? ChainNativeToken : tokenMap[address.toLowerCase()];
  } else {
    tokenObject = tokenMap[address.toLowerCase()];
  }
  return Assets.fullPath(getTokenIconPath(tokenObject, getChainId()));
}

export const tokenSymbol = (address: string) => {
  if (!address) return '';
  const tokenMap = tokenStore.tokenMap;
  let tokenObject = tokenMap[address.toLowerCase()];
  if (!tokenObject) {
    tokenObject = tokenMap[address];
  }
  return tokenObject ? tokenObject.symbol : '';
}

// staking common
export const getLockedTokenObject = (info: any, tokenInfo: any, tokenMap?: any) => {
  if (info) {
    if (info.lockTokenType == LockTokenType.ERC20_Token) {
      if (!tokenMap) {
        tokenMap = tokenStore.tokenMap;
      }
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
      tokenMap = tokenStore.tokenMap;
    }
    if (info.lockTokenType == LockTokenType.ERC20_Token) {
      return [getTokenIconPath(tokenObject, chainId)];
    }
    if (info.lockTokenType == LockTokenType.LP_Token) {
      const nativeToken = DefaultTokens[chainId]?.find((token) => token.isNative);
      const token0 = tokenMap[tokenObject.token0] || nativeToken;
      const token1 = tokenMap[tokenObject.token1] || nativeToken;
      return [getTokenIconPath(token0, chainId), getTokenIconPath(token1, chainId)];
    }
    if (info.lockTokenType == LockTokenType.VAULT_Token) {
      return [getTokenIconPath(tokenObject.assetToken, chainId)];
    }
  }
  return [];
}

export const getTokenDecimals = (address: string) => {
  let chainId = getChainId();
  const Address = getAddresses(chainId);
  const ChainNativeToken = getChainNativeToken(chainId);
  const tokenObject = (!address || address.toLowerCase() === Address['WETH9'].toLowerCase()) ? ChainNativeToken : tokenStore.tokenMap[address.toLowerCase()];
  return tokenObject ? tokenObject.decimals : 18;
}

export const baseUrl = 'https://openswap.xyz/#';

export const getTokenUrl = `${baseUrl}/swap`;
export const isThemeApplied = false;
export const isMultiple = false;
export const maxWidth = '690px';
export const maxHeight = '321px';

export * from './utils';
