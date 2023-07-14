import { BigNumber } from "@ijstech/eth-wallet";
import { moment } from '@ijstech/components';

export enum SITE_ENV {
  DEV = 'dev',
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export const explorerTxUrlsByChainId: { [key: number]: string } = {
  1: 'https://etherscan.io/tx/',
  4: 'https://rinkeby.etherscan.io/tx/',
  42: 'https://kovan.etherscan.io/tx/',
  56: 'https://bscscan.com/tx/',
  97: 'https://testnet.bscscan.com/tx/',
  43113: 'https://testnet.snowtrace.io/tx/',
  43114: 'https://snowtrace.io/tx/',
  137: 'https://polygonscan.com/tx/',
  80001: 'https://mumbai.polygonscan.com/tx/',
  250: 'https://ftmscan.com/tx/',
  4002: 'https://testnet.ftmscan.com/tx/',
  13370: 'https://aminoxtestnet.blockscout.alphacarbon.network/tx/',
  421613: 'https://goerli.arbiscan.io/tx/'
}

export const explorerAddressUrlsByChainId: {[key: number]: string} = {
  1: 'https://etherscan.io/address/',
  4: 'https://rinkeby.etherscan.io/address/',
  42: 'https://kovan.etherscan.io/address/',
  97: 'https://testnet.bscscan.com/address/',
  56: 'https://bscscan.com/address/',
  43113: 'https://testnet.snowtrace.io/address/',
  43114: 'https://snowtrace.io/address/',
  137: 'https://polygonscan.com/address/',
  80001: 'https://mumbai.polygonscan.com/address/',
  250: 'https://ftmscan.com/address/',
  4002: 'https://testnet.ftmscan.com/address/',
  13370: 'https://aminoxtestnet.blockscout.alphacarbon.network/address/',
  421613: 'https://goerli.arbiscan.io/address/'
}

export const DefaultDateFormat = 'DD/MM/YYYY';

export const formatDate = (date: any, customType?: string, showTimezone?: boolean) => {
  const formatType = customType || DefaultDateFormat;
  const formatted = moment(date).format(formatType);
  if (showTimezone) {
    return `${formatted} (UTC+${moment().utcOffset() / 60})`;
  }
  return formatted;
}

export const formatNumber = (value: any, decimals?: number) => {
  let val = value;
  const minValue = '0.0000001';
  if (typeof value === 'string') {
    val = new BigNumber(value).toNumber();
  } else if (typeof value === 'object') {
    val = value.toNumber();
  }
  if (val != 0 && new BigNumber(val).lt(minValue)) {
    return `<${minValue}`;
  }
  return formatNumberWithSeparators(val, decimals || 4);
};

export const formatNumberWithSeparators = (value: number, precision?: number) => {
  if (!value) value = 0;
  if (precision) {
    let outputStr = '';
    if (value >= 1) {
      const unit = Math.pow(10, precision);
      const rounded = Math.floor(value * unit) / unit;
      outputStr = rounded.toLocaleString('en-US', { maximumFractionDigits: precision });
    } else {
      outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
    }
    if (outputStr.length > 18) {
      outputStr = outputStr.substring(0, 18) + '...';
    }
    return outputStr;
  }
  return value.toLocaleString('en-US');
}

export const isInvalidInput = (val: any) => {
  const value = new BigNumber(val);
  if (value.lt(0)) return true;
  return (val || '').toString().substring(0, 2) === '00' || val === '-';
};

export const limitInputNumber = (input: any, decimals?: number) => {
  const amount = input.value;
  if (isInvalidInput(amount)) {
    input.value = '0';
    return;
  }
  if (!new BigNumber(amount).isNaN()) {
    input.value = limitDecimals(amount, decimals || 18);
  }
}

export const limitDecimals = (value: any, decimals: number) => {
  let val = value;
  if (typeof value !== 'string') {
    val = val.toString();
  }
  let chart;
  if (val.includes('.')) {
    chart = '.';
  } else if (val.includes(',')) {
    chart = ',';
  } else {
    return value;
  }
  const parts = val.split(chart);
  let decimalsPart = parts[1];
  if (decimalsPart && decimalsPart.length > decimals) {
    parts[1] = decimalsPart.substr(0, decimals);
  }
  return parts.join(chart);
}

export const viewOnExplorerByTxHash = (chainId: number, txHash: string) => {
  if (explorerTxUrlsByChainId[chainId]) {
    let url = `${explorerTxUrlsByChainId[chainId]}${txHash}`;
    window.open(url);
  }
}

export const viewOnExplorerByAddress = (chainId: number, address: string) => {
  if (explorerAddressUrlsByChainId[chainId]) {
    let url = `${explorerAddressUrlsByChainId[chainId]}${address}`;
    window.open(url);
  }
}

export function isWalletAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}