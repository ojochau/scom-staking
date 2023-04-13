export default {
  "name": "@scom-staking/main",
  "env": "mainnet",
  "version": "0.1.0",
  "moduleDir": "src",
  "main": "@scom-staking/main",
  "modules": {
    "@scom-staking/main": {
      "path": "main"
    },
    "@scom-staking/assets": {
      "path": "assets"
    },
    "@scom-staking/global": {
      "path": "global"
    },
    "@scom-staking/store": {
      "path": "store"
    },
    "@scom-staking/common": {
      "path": "common"
    },
    "@scom-staking/staking-utils": {
      "path": "staking-utils"
    },
    "@scom-staking/manage-stake": {
      "path": "manage-stake"
    }
  },
  "dependencies": {
    "@ijstech/eth-wallet-web3modal": "*",
    "@ijstech/eth-contract": "*",
    "@scom/oswap-openswap-contract": "*",
    "@scom/oswap-chainlink-contract": "*",
    "@scom/oswap-cross-chain-bridge-contract": "*",
    "@scom/oswap-time-is-money-contract": "*",
    "@scom/scom-binance-chain-wallet": "*",
    "@scom/scom-bit-keep-wallet": "*",
    "@scom/scom-coin98-wallet": "*",
    "@scom/scom-frontier-wallet": "*",
    "@scom/scom-onto-wallet": "*",
    "@scom/scom-trust-wallet": "*"
  },
  "InfuraId": "adc596bf88b648e2a8902bc9093930c5"
}