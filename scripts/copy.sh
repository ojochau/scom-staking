rm -rf src/contracts &&
mkdir -p src/contracts/oswap-openswap-contract &&
mkdir -p src/contracts/oswap-time-is-money-contract &&
mkdir -p src/contracts/oswap-chainlink-contract &&
mkdir -p src/contracts/oswap-cross-chain-bridge-contract &&
cp -r node_modules/@scom/oswap-openswap-contract/src/* src/contracts/oswap-openswap-contract &&
cp -r node_modules/@scom/oswap-time-is-money-contract/src/* src/contracts/oswap-time-is-money-contract &&
cp -r node_modules/@scom/oswap-chainlink-contract/src/* src/contracts/oswap-chainlink-contract &&
cp -r node_modules/@scom/oswap-cross-chain-bridge-contract/src/* src/contracts/oswap-cross-chain-bridge-contract &&
rm -rf src/wallets &&
mkdir -p src/wallets/scom-binance-chain-wallet &&
mkdir -p src/wallets/scom-bit-keep-wallet &&
mkdir -p src/wallets/scom-coin98-wallet &&
mkdir -p src/wallets/scom-frontier-wallet &&
mkdir -p src/wallets/scom-onto-wallet &&
mkdir -p src/wallets/scom-trust-wallet &&
cp -r node_modules/@scom/scom-binance-chain-wallet/src/* src/wallets/scom-binance-chain-wallet &&
cp -r node_modules/@scom/scom-bit-keep-wallet/src/* src/wallets/scom-bit-keep-wallet &&
cp -r node_modules/@scom/scom-coin98-wallet/src/* src/wallets/scom-coin98-wallet &&
cp -r node_modules/@scom/scom-frontier-wallet/src/* src/wallets/scom-frontier-wallet &&
cp -r node_modules/@scom/scom-onto-wallet/src/* src/wallets/scom-onto-wallet &&
cp -r node_modules/@scom/scom-trust-wallet/src/* src/wallets/scom-trust-wallet &&
cp -r src/wallets/*/img/* src/img