var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-staking/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let moduleDir = components_1.application.currentModuleDir;
    function fullPath(path) {
        if (path.indexOf('://') > 0)
            return path;
        return `${moduleDir}/${path}`;
    }
    exports.default = {
        fullPath
    };
});
define("@scom/scom-staking/global/utils/helper.ts", ["require", "exports", "@ijstech/eth-wallet", "@ijstech/components"], function (require, exports, eth_wallet_1, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.limitInputNumber = exports.isInvalidInput = exports.formatNumber = exports.formatDate = exports.DefaultDateFormat = void 0;
    exports.DefaultDateFormat = 'DD/MM/YYYY';
    const formatDate = (date, customType, showTimezone) => {
        const formatType = customType || exports.DefaultDateFormat;
        const formatted = (0, components_2.moment)(date).format(formatType);
        if (showTimezone) {
            return `${formatted} (UTC+${(0, components_2.moment)().utcOffset() / 60})`;
        }
        return formatted;
    };
    exports.formatDate = formatDate;
    const formatNumber = (value, decimalFigures) => {
        const newValue = typeof value === 'object' ? value.toFixed() : value;
        const minValue = '0.0000001';
        return components_2.FormatUtils.formatNumber(newValue, { decimalFigures: decimalFigures || 4, minValue });
    };
    exports.formatNumber = formatNumber;
    const isInvalidInput = (val) => {
        const value = new eth_wallet_1.BigNumber(val);
        if (value.lt(0))
            return true;
        return (val || '').toString().substring(0, 2) === '00' || val === '-';
    };
    exports.isInvalidInput = isInvalidInput;
    const limitInputNumber = (input, decimals) => {
        const amount = input.value;
        if ((0, exports.isInvalidInput)(amount)) {
            input.value = '0';
            return;
        }
        const bigValue = new eth_wallet_1.BigNumber(amount);
        if (!bigValue.isNaN() && !bigValue.isZero() && /\d+\.\d+/g.test(amount || '')) {
            input.value = new eth_wallet_1.BigNumber(amount).dp(decimals || 18, 1).toFixed();
        }
    };
    exports.limitInputNumber = limitInputNumber;
});
define("@scom/scom-staking/global/utils/common.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerSendTxEvents = void 0;
    const registerSendTxEvents = (sendTxEventHandlers) => {
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        wallet.registerSendTxEvents({
            transactionHash: (error, receipt) => {
                if (sendTxEventHandlers.transactionHash) {
                    sendTxEventHandlers.transactionHash(error, receipt);
                }
            },
            confirmation: (receipt) => {
                if (sendTxEventHandlers.confirmation) {
                    sendTxEventHandlers.confirmation(receipt);
                }
            },
        });
    };
    exports.registerSendTxEvents = registerSendTxEvents;
});
define("@scom/scom-staking/global/utils/interfaces.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LockTokenType = exports.CurrentMode = void 0;
    var CurrentMode;
    (function (CurrentMode) {
        CurrentMode[CurrentMode["STAKE"] = 0] = "STAKE";
        CurrentMode[CurrentMode["UNLOCK"] = 1] = "UNLOCK";
    })(CurrentMode = exports.CurrentMode || (exports.CurrentMode = {}));
    var LockTokenType;
    (function (LockTokenType) {
        LockTokenType[LockTokenType["ERC20_Token"] = 0] = "ERC20_Token";
        LockTokenType[LockTokenType["LP_Token"] = 1] = "LP_Token";
        LockTokenType[LockTokenType["VAULT_Token"] = 2] = "VAULT_Token";
    })(LockTokenType = exports.LockTokenType || (exports.LockTokenType = {}));
});
define("@scom/scom-staking/global/utils/index.ts", ["require", "exports", "@scom/scom-staking/global/utils/helper.ts", "@scom/scom-staking/global/utils/common.ts", "@scom/scom-staking/global/utils/interfaces.ts"], function (require, exports, helper_1, common_1, interfaces_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerSendTxEvents = void 0;
    ///<amd-module name='@scom/scom-staking/global/utils/index.ts'/> 
    __exportStar(helper_1, exports);
    Object.defineProperty(exports, "registerSendTxEvents", { enumerable: true, get: function () { return common_1.registerSendTxEvents; } });
    __exportStar(interfaces_1, exports);
});
define("@scom/scom-staking/global/index.ts", ["require", "exports", "@scom/scom-staking/global/utils/index.ts"], function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-staking/global/index.ts'/> 
    __exportStar(index_1, exports);
});
define("@scom/scom-staking/store/data/index.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.USDPeggedTokenAddressMap = void 0;
    ///<amd-module name='@scom/scom-staking/store/data/index.ts'/> 
    const USDPeggedTokenAddressMap = {
        56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        97: '0xDe9334C157968320f26e449331D6544b89bbD00F',
        43113: '0xb9c31ea1d475c25e58a1be1a46221db55e5a7c6e',
        43114: '0xc7198437980c041c805a1edcba50c1ce5db95118', //USDT.e
    };
    exports.USDPeggedTokenAddressMap = USDPeggedTokenAddressMap;
});
define("@scom/scom-staking/store/utils.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-network-list", "@ijstech/components", "@scom/scom-staking/store/data/index.ts"], function (require, exports, eth_wallet_3, scom_network_list_1, components_3, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isClientWalletConnected = exports.State = void 0;
    __exportStar(index_2, exports);
    class State {
        constructor(options) {
            this.networkMap = {};
            this.infuraId = '';
            this.stakingStatusMap = {};
            this.proxyAddresses = {};
            this.embedderCommissionFee = '0';
            this.rpcWalletId = '';
            this.networkMap = (0, scom_network_list_1.default)();
            this.initData(options);
        }
        initData(options) {
            if (options.infuraId) {
                this.infuraId = options.infuraId;
            }
            if (options.networks) {
                this.setNetworkList(options.networks, options.infuraId);
            }
            if (options.proxyAddresses) {
                this.proxyAddresses = options.proxyAddresses;
            }
            if (options.embedderCommissionFee) {
                this.embedderCommissionFee = options.embedderCommissionFee;
            }
        }
        initRpcWallet(chainId) {
            if (this.rpcWalletId) {
                return this.rpcWalletId;
            }
            const clientWallet = eth_wallet_3.Wallet.getClientInstance();
            const networkList = Object.values(components_3.application.store?.networkMap || []);
            const instanceId = clientWallet.initRpcWallet({
                networks: networkList,
                defaultChainId: chainId,
                infuraId: components_3.application.store?.infuraId,
                multicalls: components_3.application.store?.multicalls
            });
            this.rpcWalletId = instanceId;
            if (clientWallet.address) {
                const rpcWallet = eth_wallet_3.Wallet.getRpcWalletInstance(instanceId);
                rpcWallet.address = clientWallet.address;
            }
            return instanceId;
        }
        setNetworkList(networkList, infuraId) {
            const wallet = eth_wallet_3.Wallet.getClientInstance();
            this.networkMap = {};
            const defaultNetworkList = (0, scom_network_list_1.default)();
            const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
                acc[cur.chainId] = cur;
                return acc;
            }, {});
            for (let network of networkList) {
                const networkInfo = defaultNetworkMap[network.chainId];
                if (!networkInfo)
                    continue;
                if (infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
                    for (let i = 0; i < network.rpcUrls.length; i++) {
                        network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, infuraId);
                    }
                }
                this.networkMap[network.chainId] = {
                    ...networkInfo,
                    ...network
                };
                wallet.setNetworkInfo(this.networkMap[network.chainId]);
            }
        }
        getProxyAddress(chainId) {
            const _chainId = chainId || eth_wallet_3.Wallet.getInstance().chainId;
            const proxyAddresses = this.proxyAddresses;
            if (proxyAddresses) {
                return proxyAddresses[_chainId];
            }
            return null;
        }
        setStakingStatus(key, value) {
            this.stakingStatusMap[key] = value;
        }
        getStakingStatus(key) {
            return this.stakingStatusMap[key];
        }
        getRpcWallet() {
            return this.rpcWalletId ? eth_wallet_3.Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
        }
        isRpcWalletConnected() {
            const wallet = this.getRpcWallet();
            return wallet?.isConnected;
        }
        getChainId() {
            const rpcWallet = this.getRpcWallet();
            return rpcWallet?.chainId;
        }
        async setApprovalModelAction(options) {
            const approvalOptions = {
                ...options,
                spenderAddress: ''
            };
            let wallet = this.getRpcWallet();
            this.approvalModel = new eth_wallet_3.ERC20ApprovalModel(wallet, approvalOptions);
            let approvalModelAction = this.approvalModel.getAction();
            return approvalModelAction;
        }
    }
    exports.State = State;
    function isClientWalletConnected() {
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        return wallet.isConnected;
    }
    exports.isClientWalletConnected = isClientWalletConnected;
});
define("@scom/scom-staking/store/index.ts", ["require", "exports", "@scom/scom-staking/assets.ts", "@scom/scom-token-list", "@scom/scom-staking/global/index.ts", "@ijstech/components", "@scom/scom-staking/store/utils.ts"], function (require, exports, assets_1, scom_token_list_1, index_3, components_4, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.maxHeight = exports.maxWidth = exports.getTokenUrl = exports.baseUrl = exports.getTokenDecimals = exports.getLockedTokenIconPaths = exports.getLockedTokenSymbol = exports.getLockedTokenObject = exports.tokenSymbol = exports.viewOnExplorerByAddress = exports.getNetworkInfo = exports.getChainNativeToken = exports.fallBackUrl = void 0;
    exports.fallBackUrl = assets_1.default.fullPath('img/tokens/token-placeholder.svg');
    const getChainNativeToken = (chainId) => {
        return scom_token_list_1.ChainNativeTokenByChainId[chainId];
    };
    exports.getChainNativeToken = getChainNativeToken;
    const getNetworkInfo = (chainId) => {
        const networkMap = components_4.application.store['networkMap'];
        return networkMap[chainId];
    };
    exports.getNetworkInfo = getNetworkInfo;
    const viewOnExplorerByAddress = (chainId, address) => {
        let network = (0, exports.getNetworkInfo)(chainId);
        if (network && network.explorerAddressUrl) {
            let url = `${network.explorerAddressUrl}${address}`;
            window.open(url);
        }
    };
    exports.viewOnExplorerByAddress = viewOnExplorerByAddress;
    const tokenSymbol = (chainId, address) => {
        if (!address)
            return '';
        const tokenMap = scom_token_list_1.tokenStore.getTokenMapByChainId(chainId);
        let tokenObject = tokenMap[address.toLowerCase()];
        if (!tokenObject) {
            tokenObject = tokenMap[address];
        }
        return tokenObject ? tokenObject.symbol : '';
    };
    exports.tokenSymbol = tokenSymbol;
    // staking common
    const getLockedTokenObject = (info, tokenInfo, tokenMap) => {
        if (info) {
            if (info.lockTokenType == index_3.LockTokenType.ERC20_Token) {
                return tokenMap[tokenInfo.tokenAddress];
            }
            if (info.lockTokenType == index_3.LockTokenType.LP_Token && tokenInfo.lpToken) {
                return tokenInfo.lpToken.object;
            }
            else if (info.lockTokenType == index_3.LockTokenType.VAULT_Token && tokenInfo.vaultToken) {
                return tokenInfo.vaultToken.object;
            }
        }
        return null;
    };
    exports.getLockedTokenObject = getLockedTokenObject;
    const getLockedTokenSymbol = (info, token) => {
        if (info) {
            if (info.lockTokenType == index_3.LockTokenType.ERC20_Token) {
                return token ? token.symbol : '';
            }
            if (info.lockTokenType == index_3.LockTokenType.LP_Token) {
                return 'LP';
            }
            if (info.lockTokenType == index_3.LockTokenType.VAULT_Token) {
                return token ? `vt${token.assetToken.symbol}` : '';
            }
        }
        return '';
    };
    exports.getLockedTokenSymbol = getLockedTokenSymbol;
    const getLockedTokenIconPaths = (info, tokenObject, chainId, tokenMap) => {
        if (info && tokenObject) {
            if (!tokenMap) {
                tokenMap = scom_token_list_1.tokenStore.getTokenMapByChainId(chainId);
            }
            if (info.lockTokenType == index_3.LockTokenType.ERC20_Token) {
                return [scom_token_list_1.assets.getTokenIconPath(tokenObject, chainId)];
            }
            if (info.lockTokenType == index_3.LockTokenType.LP_Token) {
                const nativeToken = scom_token_list_1.DefaultTokens[chainId]?.find((token) => token.isNative);
                const token0 = tokenMap[tokenObject.token0] || nativeToken;
                const token1 = tokenMap[tokenObject.token1] || nativeToken;
                return [scom_token_list_1.assets.getTokenIconPath(token0, chainId), scom_token_list_1.assets.getTokenIconPath(token1, chainId)];
            }
            if (info.lockTokenType == index_3.LockTokenType.VAULT_Token) {
                return [scom_token_list_1.assets.getTokenIconPath(tokenObject.assetToken, chainId)];
            }
        }
        return [];
    };
    exports.getLockedTokenIconPaths = getLockedTokenIconPaths;
    const getTokenDecimals = (address, chainId) => {
        const ChainNativeToken = (0, exports.getChainNativeToken)(chainId);
        const tokenMap = scom_token_list_1.tokenStore.getTokenMapByChainId(chainId);
        const tokenObject = (!address || address.toLowerCase() === scom_token_list_1.WETHByChainId[chainId].address.toLowerCase()) ? ChainNativeToken : tokenMap[address.toLowerCase()];
        return tokenObject ? tokenObject.decimals : 18;
    };
    exports.getTokenDecimals = getTokenDecimals;
    exports.baseUrl = 'https://openswap.xyz/#';
    exports.getTokenUrl = `${exports.baseUrl}/swap`;
    exports.maxWidth = '690px';
    exports.maxHeight = 321;
    __exportStar(utils_1, exports);
});
define("@scom/scom-staking/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-staking/data.json.ts'/> 
    exports.default = {
        "defaultBuilderData": {
            "chainId": 43113,
            "name": "Staking",
            "desc": "Earn OSWAP",
            "showContractLink": true,
            "staking": {
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
                }
            ],
            "wallets": [
                {
                    "name": "metamask"
                }
            ]
        }
    };
});
define("@scom/scom-staking/staking-utils/index.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/oswap-time-is-money-contract", "@scom/oswap-openswap-contract", "@scom/oswap-chainlink-contract", "@scom/oswap-cross-chain-bridge-contract", "@scom/scom-staking/store/index.ts", "@scom/scom-token-list"], function (require, exports, eth_wallet_4, oswap_time_is_money_contract_1, oswap_openswap_contract_1, oswap_chainlink_contract_1, oswap_cross_chain_bridge_contract_1, index_4, scom_token_list_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseDepositEvent = exports.getProxySelectors = exports.lockToken = exports.claimToken = exports.withdrawToken = exports.getVaultRewardCurrentAPR = exports.getLPRewardCurrentAPR = exports.getERC20RewardCurrentAPR = exports.getVaultBalance = exports.getVaultObject = exports.getLPBalance = exports.getLPObject = exports.getStakingTotalLocked = exports.getCampaignInfo = exports.getTokenPrice = void 0;
    const getTokenPrice = async (wallet, token) => {
        let chainId = wallet.chainId;
        let tokenPrice;
        // get price from price feed 
        let tokenPriceFeedAddress = scom_token_list_2.ToUSDPriceFeedAddressesMap[chainId][token.toLowerCase()];
        if (tokenPriceFeedAddress) {
            let aggregator = new oswap_chainlink_contract_1.Contracts.EACAggregatorProxy(wallet, tokenPriceFeedAddress);
            let tokenLatestRoundData = await aggregator.latestRoundData();
            let tokenPriceFeedDecimals = await aggregator.decimals();
            return tokenLatestRoundData.answer.shiftedBy(-tokenPriceFeedDecimals).toFixed();
        }
        // get price from AMM
        let referencePair = scom_token_list_2.tokenPriceAMMReference[chainId][token.toLowerCase()];
        if (!referencePair)
            return null;
        let pair = new oswap_openswap_contract_1.Contracts.OSWAP_Pair(wallet, referencePair);
        let token0 = await pair.token0();
        let token1 = await pair.token1();
        let reserves = await pair.getReserves();
        let token0PriceFeedAddress = scom_token_list_2.ToUSDPriceFeedAddressesMap[chainId][token0.toLowerCase()];
        let token1PriceFeedAddress = scom_token_list_2.ToUSDPriceFeedAddressesMap[chainId][token1.toLowerCase()];
        if (token0PriceFeedAddress || token1PriceFeedAddress) {
            if (token0PriceFeedAddress) {
                let aggregator = new oswap_chainlink_contract_1.Contracts.EACAggregatorProxy(wallet, token0PriceFeedAddress);
                let token0LatestRoundData = await aggregator.latestRoundData();
                let token0PriceFeedDecimals = await aggregator.decimals();
                let token0USDPrice = new eth_wallet_4.BigNumber(token0LatestRoundData.answer).shiftedBy(-token0PriceFeedDecimals).toFixed();
                if (new eth_wallet_4.BigNumber(token.toLowerCase()).lt(token0.toLowerCase())) {
                    tokenPrice = new eth_wallet_4.BigNumber(reserves.reserve1).div(reserves.reserve0).times(token0USDPrice).toFixed();
                }
                else {
                    tokenPrice = new eth_wallet_4.BigNumber(reserves.reserve0).div(reserves.reserve1).times(token0USDPrice).toFixed();
                }
            }
            else {
                let aggregator = new oswap_chainlink_contract_1.Contracts.EACAggregatorProxy(wallet, token1PriceFeedAddress);
                let token1LatestRoundData = await aggregator.latestRoundData();
                let token1PriceFeedDecimals = await aggregator.decimals();
                let token1USDPrice = new eth_wallet_4.BigNumber(token1LatestRoundData.answer).shiftedBy(-token1PriceFeedDecimals).toFixed();
                if (new eth_wallet_4.BigNumber(token.toLowerCase()).lt(token1.toLowerCase())) {
                    tokenPrice = new eth_wallet_4.BigNumber(reserves.reserve1).div(reserves.reserve0).times(token1USDPrice).toFixed();
                }
                else {
                    tokenPrice = new eth_wallet_4.BigNumber(reserves.reserve0).div(reserves.reserve1).times(token1USDPrice).toFixed();
                }
            }
        }
        else {
            if (token0.toLowerCase() == token.toLowerCase()) { //for other reference pair
                let token1Price = await (0, exports.getTokenPrice)(wallet, token1);
                if (!token1Price)
                    return null;
                tokenPrice = new eth_wallet_4.BigNumber(token1Price).times(reserves.reserve1).div(reserves.reserve0).toFixed();
            }
            else {
                let token0Price = await (0, exports.getTokenPrice)(wallet, token0);
                if (!token0Price)
                    return null;
                tokenPrice = new eth_wallet_4.BigNumber(token0Price).times(reserves.reserve0).div(reserves.reserve1).toFixed();
            }
        }
        return tokenPrice;
    };
    exports.getTokenPrice = getTokenPrice;
    const getDefaultStakingByAddress = async (wallet, option) => {
        try {
            let currentAddress = wallet.address;
            let stakingAddress = option.address;
            let rewards = [option.rewards];
            let hasRewardAddress = rewards.length && rewards[0].address;
            let timeIsMoney = new oswap_time_is_money_contract_1.Contracts.TimeIsMoney(wallet, stakingAddress);
            let mode = '';
            let multicallResult = await wallet.doMulticall([
                {
                    contract: timeIsMoney,
                    methodName: 'minimumLockTime',
                    params: [],
                    to: stakingAddress
                },
                {
                    contract: timeIsMoney,
                    methodName: 'maximumTotalLock',
                    params: [],
                    to: stakingAddress
                },
                {
                    contract: timeIsMoney,
                    methodName: 'totalLocked',
                    params: [],
                    to: stakingAddress
                },
                {
                    contract: timeIsMoney,
                    methodName: 'getCredit',
                    params: [currentAddress],
                    to: stakingAddress
                },
                {
                    contract: timeIsMoney,
                    methodName: 'lockAmount',
                    params: [currentAddress],
                    to: stakingAddress
                },
                {
                    contract: timeIsMoney,
                    methodName: 'withdrawn',
                    params: [currentAddress],
                    to: stakingAddress
                },
                {
                    contract: timeIsMoney,
                    methodName: 'token',
                    params: [],
                    to: stakingAddress
                },
                {
                    contract: timeIsMoney,
                    methodName: 'endOfEntryPeriod',
                    params: [],
                    to: stakingAddress
                },
                {
                    contract: timeIsMoney,
                    methodName: 'perAddressCap',
                    params: [],
                    to: stakingAddress
                },
                {
                    contract: timeIsMoney,
                    methodName: 'startOfEntryPeriod',
                    params: [],
                    to: stakingAddress
                }
            ]);
            const minimumLockTime = multicallResult[0];
            const maximumTotalLock = multicallResult[1];
            const totalLockedWei = multicallResult[2];
            const totalCreditWei = multicallResult[3];
            const lockAmountWei = multicallResult[4];
            const withdrawn = multicallResult[5];
            const tokenAddress = multicallResult[6];
            const endOfEntryPeriod = multicallResult[7].toFixed();
            const perAddressCapWei = multicallResult[8];
            let startOfEntryPeriod = '0';
            if (multicallResult[9]) {
                startOfEntryPeriod = multicallResult[9].toFixed();
            }
            let totalCredit = eth_wallet_4.Utils.fromDecimals(totalCreditWei).toFixed();
            let lockAmount = eth_wallet_4.Utils.fromDecimals(lockAmountWei).toFixed();
            let stakeQty = withdrawn ? '0' : lockAmount;
            if (new eth_wallet_4.BigNumber(totalCredit).gt(0) && hasRewardAddress) {
                mode = 'Claim';
            }
            else if (new eth_wallet_4.BigNumber(stakeQty).isZero()) {
                mode = 'Stake';
            }
            else {
                mode = 'Unlock';
            }
            let stakingDecimals = 18 - (0, index_4.getTokenDecimals)(tokenAddress.toLocaleLowerCase(), wallet.chainId);
            let perAddressCap = eth_wallet_4.Utils.fromDecimals(perAddressCapWei).shiftedBy(stakingDecimals).toFixed();
            let maxTotalLock = eth_wallet_4.Utils.fromDecimals(maximumTotalLock).shiftedBy(stakingDecimals).toFixed();
            let totalLocked = eth_wallet_4.Utils.fromDecimals(totalLockedWei).toFixed();
            let obj = {
                mode,
                minLockTime: minimumLockTime.toNumber(),
                maxTotalLock,
                totalLocked,
                stakeQty,
                startOfEntryPeriod: parseInt(startOfEntryPeriod) * 1000,
                endOfEntryPeriod: parseInt(endOfEntryPeriod) * 1000,
                perAddressCap,
                lockTokenAddress: tokenAddress,
                tokenAddress: tokenAddress.toLowerCase(),
            };
            if (hasRewardAddress) {
                let rewardsData = [];
                for (let index = 0; index < rewards.length; index++) {
                    let reward = rewards[index];
                    let rewardsContract, admin, multiplier, initialReward, rewardTokenAddress, vestingPeriod, vestingStartDate, claimDeadline;
                    try {
                        let claimable = '0';
                        if (reward.isCommonStartDate) {
                            rewardsContract = new oswap_time_is_money_contract_1.Contracts.RewardsCommonStartDate(wallet, reward.address);
                        }
                        else {
                            rewardsContract = new oswap_time_is_money_contract_1.Contracts.Rewards(wallet, reward.address);
                        }
                        let mulicallContracts = [
                            {
                                contract: rewardsContract,
                                methodName: 'admin',
                                params: [],
                                to: reward.address
                            },
                            {
                                contract: rewardsContract,
                                methodName: 'token',
                                params: [],
                                to: reward.address
                            },
                            {
                                contract: rewardsContract,
                                methodName: 'multiplier',
                                params: [],
                                to: reward.address
                            },
                            {
                                contract: rewardsContract,
                                methodName: 'initialReward',
                                params: [],
                                to: reward.address
                            },
                            {
                                contract: rewardsContract,
                                methodName: 'vestingPeriod',
                                params: [],
                                to: reward.address
                            },
                            {
                                contract: rewardsContract,
                                methodName: 'claimDeadline',
                                params: [],
                                to: reward.address
                            }
                        ];
                        if (mode === 'Claim') {
                            mulicallContracts.push({
                                contract: rewardsContract,
                                methodName: 'unclaimedForAccount',
                                params: [currentAddress],
                                to: reward.address
                            });
                        }
                        if (reward.isCommonStartDate) {
                            mulicallContracts.push({
                                contract: rewardsContract,
                                methodName: 'vestingStartDate',
                                params: [],
                                to: reward.address
                            });
                        }
                        let multicallResult = await wallet.doMulticall(mulicallContracts);
                        admin = multicallResult[0];
                        rewardTokenAddress = multicallResult[1];
                        let multiplierWei = multicallResult[2];
                        initialReward = multicallResult[3].toFixed();
                        vestingPeriod = multicallResult[4].toNumber();
                        claimDeadline = multicallResult[5].toNumber();
                        if (mode === 'Claim') {
                            claimable = eth_wallet_4.Utils.fromDecimals(multicallResult[6]).toFixed();
                        }
                        if (reward.isCommonStartDate) {
                            vestingStartDate = multicallResult[7].toNumber();
                        }
                        let rewardToken = new oswap_openswap_contract_1.Contracts.ERC20(wallet, rewardTokenAddress);
                        let rewardTokenDecimals = await (await rewardToken.decimals()).toNumber();
                        multiplier = eth_wallet_4.Utils.fromDecimals(multiplierWei, rewardTokenDecimals).toFixed();
                        let rewardAmount = new eth_wallet_4.BigNumber(multiplier).multipliedBy(maxTotalLock).toFixed();
                        rewardsData.push({
                            ...reward,
                            claimable,
                            rewardTokenAddress,
                            multiplier,
                            initialReward,
                            vestingPeriod,
                            admin,
                            vestingStartDate,
                            rewardAmount,
                            index
                        });
                    }
                    catch { }
                }
                return {
                    ...option,
                    ...obj,
                    rewardsData: rewardsData,
                    rewards: rewardsData.sort((a, b) => a.index - b.index)
                };
            }
            else {
                return obj;
            }
        }
        catch (err) {
            console.log('err', err);
            return null;
        }
    };
    const getCampaignInfo = async (wallet, stakingInfo) => {
        let chainId = wallet.chainId;
        let stakingCampaignInfo = stakingInfo[chainId];
        if (!stakingCampaignInfo)
            return null;
        let staking = { ...stakingCampaignInfo.staking };
        let optionExtendedInfo;
        try {
            optionExtendedInfo = await getDefaultStakingByAddress(wallet, staking);
        }
        catch (error) {
            return null;
        }
        let stakingExtendInfo = { ...staking, ...optionExtendedInfo };
        // const admin = stakingExtendInfo.rewards && stakingExtendInfo.rewards[0] ? stakingExtendInfo.rewards[0].admin : '';
        return {
            // admin,
            ...stakingCampaignInfo,
            campaignStart: stakingExtendInfo.startOfEntryPeriod / 1000,
            campaignEnd: stakingExtendInfo.endOfEntryPeriod / 1000,
            tokenAddress: stakingExtendInfo.tokenAddress?.toLowerCase(),
            option: stakingExtendInfo
        };
    };
    exports.getCampaignInfo = getCampaignInfo;
    const getStakingTotalLocked = async (wallet, stakingAddress) => {
        let timeIsMoney = new oswap_time_is_money_contract_1.Contracts.TimeIsMoney(wallet, stakingAddress);
        let totalLockedWei = await timeIsMoney.totalLocked();
        let totalLocked = eth_wallet_4.Utils.fromDecimals(totalLockedWei).toFixed();
        return totalLocked;
    };
    exports.getStakingTotalLocked = getStakingTotalLocked;
    const getWETH = (wallet) => {
        let wrappedToken = scom_token_list_2.WETHByChainId[wallet.chainId];
        return wrappedToken;
    };
    const getLPObject = async (wallet, pairAddress) => {
        try {
            const WETH = getWETH(wallet);
            let pair = new oswap_openswap_contract_1.Contracts.OSWAP_Pair(wallet, pairAddress);
            let getSymbol = await pair.symbol();
            let getName = await pair.name();
            let getDecimal = await pair.decimals();
            let token0 = (await pair.token0()).toLowerCase();
            let token1 = (await pair.token1()).toLowerCase();
            return {
                address: pairAddress.toLowerCase(),
                decimals: getDecimal.toFixed(),
                name: getName,
                symbol: getSymbol,
                token0: token0 == WETH.address.toLowerCase() ? '' : token0,
                token1: token1 == WETH.address.toLowerCase() ? '' : token1
            };
        }
        catch (e) {
            return null;
        }
    };
    exports.getLPObject = getLPObject;
    const getLPBalance = async (wallet, pairAddress) => {
        let pair = new oswap_openswap_contract_1.Contracts.OSWAP_Pair(wallet, pairAddress);
        let balance = await pair.balanceOf(wallet.address);
        return eth_wallet_4.Utils.fromDecimals(balance).toFixed();
    };
    exports.getLPBalance = getLPBalance;
    const getVaultObject = async (wallet, vaultAddress) => {
        try {
            let vault = new oswap_cross_chain_bridge_contract_1.Contracts.OSWAP_BridgeVault(wallet, vaultAddress);
            let symbol = await vault.symbol();
            let name = await vault.name();
            let decimals = await vault.decimals();
            let tokenMap = scom_token_list_2.tokenStore.getTokenMapByChainId(wallet.chainId);
            let assetToken = tokenMap[vaultAddress.toLowerCase()];
            return {
                address: vaultAddress.toLowerCase(),
                decimals,
                name,
                symbol,
                assetToken
            };
        }
        catch {
            return {};
        }
    };
    exports.getVaultObject = getVaultObject;
    const getVaultBalance = async (wallet, vaultAddress) => {
        let vault = new oswap_cross_chain_bridge_contract_1.Contracts.OSWAP_BridgeVault(wallet, vaultAddress);
        let balance = await vault.balanceOf(wallet.address);
        return eth_wallet_4.Utils.fromDecimals(balance).toFixed();
    };
    exports.getVaultBalance = getVaultBalance;
    const getERC20RewardCurrentAPR = async (wallet, rewardOption, lockedToken, lockedDays) => {
        let chainId = wallet.chainId;
        const usdPeggedTokenAddress = index_4.USDPeggedTokenAddressMap[chainId];
        if (!usdPeggedTokenAddress)
            return '';
        let APR = "";
        let rewardPrice = await (0, exports.getTokenPrice)(wallet, rewardOption.rewardTokenAddress);
        let lockedTokenPrice = await (0, exports.getTokenPrice)(wallet, lockedToken.address);
        if (!rewardPrice || !lockedTokenPrice)
            return null;
        APR = new eth_wallet_4.BigNumber(rewardOption.multiplier).times(new eth_wallet_4.BigNumber(rewardPrice).times(365)).div(new eth_wallet_4.BigNumber(lockedTokenPrice).times(lockedDays)).toFixed();
        return APR;
    };
    exports.getERC20RewardCurrentAPR = getERC20RewardCurrentAPR;
    const getReservesByPair = async (wallet, pairAddress, tokenInAddress, tokenOutAddress) => {
        let reserveObj;
        let pair = new oswap_openswap_contract_1.Contracts.OSWAP_Pair(wallet, pairAddress);
        let reserves = await pair.getReserves();
        if (!tokenInAddress || !tokenOutAddress) {
            tokenInAddress = await pair.token0();
            tokenOutAddress = await pair.token1();
        }
        if (tokenInAddress && tokenOutAddress) {
            if (new eth_wallet_4.BigNumber(tokenInAddress.toLowerCase()).lt(tokenOutAddress.toLowerCase())) {
                reserveObj = {
                    reserveA: reserves.reserve0,
                    reserveB: reserves.reserve1
                };
            }
            else {
                reserveObj = {
                    reserveA: reserves.reserve1,
                    reserveB: reserves.reserve0
                };
            }
        }
        return reserveObj;
    };
    const getLPRewardCurrentAPR = async (wallet, rewardOption, lpObject, lockedDays) => {
        if (!lpObject)
            return '';
        const WETH = getWETH(wallet);
        const WETHAddress = WETH.address;
        let chainId = wallet.chainId;
        const usdPeggedTokenAddress = index_4.USDPeggedTokenAddressMap[chainId];
        if (!usdPeggedTokenAddress)
            return '';
        let APR = '';
        if (lpObject.token0.toLowerCase() == usdPeggedTokenAddress.toLowerCase() || lpObject.token1.toLowerCase() == usdPeggedTokenAddress.toLowerCase()) {
            let rewardPrice = '';
            if (rewardOption.APROption && rewardOption.APROption == 1) {
                let WETH9PriceFeedAddress = scom_token_list_2.ToUSDPriceFeedAddressesMap[chainId][WETHAddress.toLowerCase()];
                if (!WETH9PriceFeedAddress)
                    return '';
                let aggregator = new oswap_chainlink_contract_1.Contracts.EACAggregatorProxy(wallet, WETH9PriceFeedAddress);
                let WETH9LatestRoundData = await aggregator.latestRoundData();
                let WETH9PriceFeedDecimals = await aggregator.decimals();
                let WETH9USDPrice = new eth_wallet_4.BigNumber(WETH9LatestRoundData.answer).shiftedBy(-WETH9PriceFeedDecimals).toFixed();
                let rewardReserves = await getReservesByPair(rewardOption.referencePair, WETHAddress, rewardOption.rewardTokenAddress);
                if (!rewardReserves)
                    return '';
                rewardPrice = new eth_wallet_4.BigNumber(rewardReserves.reserveA).div(rewardReserves.reserveB).times(WETH9USDPrice).toFixed();
            }
            else {
                let rewardReserves = await getReservesByPair(rewardOption.referencePair, usdPeggedTokenAddress, rewardOption.rewardTokenAddress);
                if (!rewardReserves)
                    return '';
                rewardPrice = new eth_wallet_4.BigNumber(rewardReserves.reserveA).div(rewardReserves.reserveB).toFixed();
            }
            let lpTokenOut = lpObject.token0.toLowerCase() == usdPeggedTokenAddress.toLowerCase() ? lpObject.token1 : lpObject.token0;
            let lockedLPReserves = await getReservesByPair(lpObject.address, usdPeggedTokenAddress, lpTokenOut);
            if (!lockedLPReserves)
                return '';
            let lockedLPPrice = new eth_wallet_4.BigNumber(lockedLPReserves.reserveA).div(lockedLPReserves.reserveB).times(2).toFixed();
            APR = new eth_wallet_4.BigNumber(rewardOption.multiplier).times(new eth_wallet_4.BigNumber(rewardPrice).times(365)).div(new eth_wallet_4.BigNumber(lockedLPPrice).times(lockedDays)).toFixed();
        }
        else {
            if (!lpObject.token0 || !lpObject.token1 || lpObject.token0.toLowerCase() == WETHAddress.toLowerCase() || lpObject.token1.toLowerCase() == WETHAddress.toLowerCase()) {
                let WETH9PriceFeedAddress = scom_token_list_2.ToUSDPriceFeedAddressesMap[chainId][WETHAddress.toLowerCase()];
                if (!WETH9PriceFeedAddress)
                    return '';
                let aggregator = new oswap_chainlink_contract_1.Contracts.EACAggregatorProxy(wallet, WETH9PriceFeedAddress);
                let WETH9LatestRoundData = await aggregator.latestRoundData();
                let WETH9PriceFeedDecimals = await aggregator.decimals();
                let WETH9USDPrice = new eth_wallet_4.BigNumber(WETH9LatestRoundData.answer).shiftedBy(-WETH9PriceFeedDecimals).toFixed();
                let rewardReserves = await getReservesByPair(rewardOption.referencePair, WETHAddress, rewardOption.rewardTokenAddress);
                if (!rewardReserves)
                    return '';
                let rewardPrice = new eth_wallet_4.BigNumber(rewardReserves.reserveA).div(rewardReserves.reserveB).times(WETH9USDPrice).toFixed();
                let otherTokenAddress = (!lpObject.token0 || lpObject.token0.toLowerCase() == WETHAddress.toLowerCase()) ? lpObject.token1 : lpObject.token0;
                let lockedLPReserves = await getReservesByPair(lpObject.address, WETHAddress, otherTokenAddress);
                if (!lockedLPReserves)
                    return '';
                let otherTokenPrice = new eth_wallet_4.BigNumber(lockedLPReserves.reserveA).div(lockedLPReserves.reserveB).times(WETH9USDPrice).toFixed();
                let lockedLPPrice = new eth_wallet_4.BigNumber(otherTokenPrice).times(2).div(new eth_wallet_4.BigNumber(otherTokenPrice).div(WETH9USDPrice).sqrt()).toFixed();
                APR = new eth_wallet_4.BigNumber(rewardOption.multiplier).times(new eth_wallet_4.BigNumber(rewardPrice).times(365)).div(new eth_wallet_4.BigNumber(lockedLPPrice).times(lockedDays)).toFixed();
            }
        }
        return APR;
    };
    exports.getLPRewardCurrentAPR = getLPRewardCurrentAPR;
    const getVaultRewardCurrentAPR = async (wallet, rewardOption, vaultObject, lockedDays) => {
        let APR = '';
        try {
            let rewardPrice = await (0, exports.getTokenPrice)(wallet, rewardOption.rewardTokenAddress);
            let assetTokenPrice = await (0, exports.getTokenPrice)(wallet, vaultObject.assetToken.address);
            if (!assetTokenPrice || !rewardPrice)
                return '';
            let vault = new oswap_cross_chain_bridge_contract_1.Contracts.OSWAP_BridgeVault(wallet, vaultObject.address);
            let vaultTokenTotalSupply = await vault.totalSupply();
            let lpAssetBalance = await vault.lpAssetBalance();
            let lpToAssetRatio = new eth_wallet_4.BigNumber(lpAssetBalance).div(vaultTokenTotalSupply).toFixed();
            let VaultTokenPrice = new eth_wallet_4.BigNumber(assetTokenPrice).times(lpToAssetRatio).toFixed();
            APR = new eth_wallet_4.BigNumber(rewardOption.multiplier).times(new eth_wallet_4.BigNumber(rewardPrice).times(365)).div(new eth_wallet_4.BigNumber(VaultTokenPrice).times(lockedDays)).toFixed();
        }
        catch { }
        return APR;
    };
    exports.getVaultRewardCurrentAPR = getVaultRewardCurrentAPR;
    const withdrawToken = async (contractAddress, callback) => {
        if (!contractAddress)
            return;
        try {
            let wallet = eth_wallet_4.Wallet.getClientInstance();
            let timeIsMoney = new oswap_time_is_money_contract_1.Contracts.TimeIsMoney(wallet, contractAddress);
            let receipt = await timeIsMoney.withdraw(true);
            return receipt;
        }
        catch (error) {
            if (callback) {
                callback(error);
            }
        }
    };
    exports.withdrawToken = withdrawToken;
    const claimToken = async (contractAddress, callback) => {
        if (!contractAddress)
            return;
        try {
            let wallet = eth_wallet_4.Wallet.getClientInstance();
            let rewards = new oswap_time_is_money_contract_1.Contracts.Rewards(wallet, contractAddress);
            let receipt = await rewards.claim();
            return receipt;
        }
        catch (error) {
            if (callback) {
                callback(error);
            }
        }
    };
    exports.claimToken = claimToken;
    const lockToken = async (token, amount, contractAddress, callback) => {
        if (!token || !contractAddress)
            return;
        try {
            let wallet = eth_wallet_4.Wallet.getClientInstance();
            let decimals = typeof token.decimals === 'object' ? token.decimals.toNumber() : token.decimals;
            let tokenAmount = eth_wallet_4.Utils.toDecimals(amount, decimals);
            let timeIsMoney = new oswap_time_is_money_contract_1.Contracts.TimeIsMoney(wallet, contractAddress);
            let receipt = await timeIsMoney.lock(tokenAmount);
            return receipt;
        }
        catch (error) {
            if (callback) {
                callback(error);
            }
        }
    };
    exports.lockToken = lockToken;
    const getProxySelectors = async (state, chainId, contractAddress) => {
        const wallet = state.getRpcWallet();
        await wallet.init();
        if (wallet.chainId != chainId)
            await wallet.switchNetwork(chainId);
        const timeIsMoney = new oswap_time_is_money_contract_1.Contracts.TimeIsMoney(wallet, contractAddress);
        const permittedProxyFunctions = [
            "lock",
            "withdraw"
        ];
        const selectors = permittedProxyFunctions
            .map((e) => e + "(" + timeIsMoney._abi.filter(f => f.name == e)[0].inputs.map(f => f.type).join(',') + ")")
            .map(e => wallet.soliditySha3(e).substring(0, 10))
            .map(e => timeIsMoney.address.toLowerCase() + e.replace("0x", ""));
        return selectors;
    };
    exports.getProxySelectors = getProxySelectors;
    const parseDepositEvent = (state, receipt, contractAddress) => {
        const wallet = state.getRpcWallet();
        let timeIsMoney = new oswap_time_is_money_contract_1.Contracts.TimeIsMoney(wallet, contractAddress);
        let event = timeIsMoney.parseDepositEvent(receipt)[0];
        return event;
    };
    exports.parseDepositEvent = parseDepositEvent;
});
define("@scom/scom-staking/manage-stake/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stakingManageStakeStyle = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    exports.stakingManageStakeStyle = components_5.Styles.style({
        $nest: {
            'input': {
                $nest: {
                    '&::-webkit-outer-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: '0',
                    },
                    '&::-webkit-inner-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: '0',
                    },
                }
            }
        }
    });
});
define("@scom/scom-staking/languages/common.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-staking/languages/common.json.ts'/> 
    exports.default = {
        "en": {
            "connect_wallet": "Connect Wallet",
            "please_connect_with_your_wallet": "Please connect with your wallet!",
            "completed": "Completed",
        },
        "zh-hant": {
            "connect_wallet": "連接錢包",
            "please_connect_with_your_wallet": "請連接您的錢包！",
            "completed": "完成",
        },
        "vi": {
            "connect_wallet": "Kết nối ví",
            "please_connect_with_your_wallet": "Vui lòng kết nối với ví của bạn!",
            "completed": "Hoàn thành",
        }
    };
});
define("@scom/scom-staking/languages/setup.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-staking/languages/setup.json.ts'/> 
    exports.default = {
        "en": {
            "connected_with_address": "Connected with {{address}}",
            "get_ready_to_stake": "Get Ready to Stake",
            "how_many_tokens_are_you_planning_to_stake": "How many tokens are you planning to stake?",
            "start": "Start",
        },
        "zh-hant": {
            "connected_with_address": "已連接至 {{address}}",
            "get_ready_to_stake": "準備好質押",
            "how_many_tokens_are_you_planning_to_stake": "您計劃質押多少個 Token？",
            "start": "開始",
        },
        "vi": {
            "connected_with_address": "Đã kết nối với {{address}}",
            "get_ready_to_stake": "Chuẩn bị để đặt cược",
            "how_many_tokens_are_you_planning_to_stake": "Bạn dự định đặt cược bao nhiêu token?",
            "start": "Bắt đầu",
        }
    };
});
define("@scom/scom-staking/languages/stake.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-staking/languages/stake.json.ts'/> 
    exports.default = {
        "en": {
            "approve_token": "Approve {{token}}",
            "stake_token": "Stake {{token}}",
            "unlock_token": "Unlock {{token}}",
            "stake": "Stake",
            "unstake": "Unstake",
            "approve": "Approve",
            "approving": "Approving",
            "staking": "Staking",
            "unstaking": "Unstaking",
            "insufficient_balance": "Insufficient Balance",
            "max": "Max",
        },
        "zh-hant": {
            "approve_token": "批准 {{token}}",
            "stake_token": "質押 {{token}}",
            "unlock_token": "解鎖 {{token}}",
            "stake": "質押",
            "unstake": "解除質押",
            "approve": "批准",
            "approving": "正在批准",
            "staking": "正在質押",
            "unstaking": "正在解除質押",
            "insufficient_balance": "餘額不足",
            "max": "最大",
        },
        "vi": {
            "approve_token": "Phê duyệt {{token}}",
            "stake_token": "Đặt cược {{token}}",
            "unlock_token": "Mở khóa {{token}}",
            "stake": "Đặt cược",
            "unstake": "Hủy đặt cược",
            "approve": "Phê duyệt",
            "approving": "Đang phê duyệt",
            "staking": "Đang đặt cược",
            "unstaking": "Đang hủy đặt cược",
            "insufficient_balance": "Số dư không đủ",
            "max": "Tối đa",
        }
    };
});
define("@scom/scom-staking/languages/main.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-staking/languages/main.json.ts'/> 
    exports.default = {
        "en": {
            "claim_token": "Claim {{token}}",
            "no_campaigns": "No Campaigns",
            "switch_network": "Switch Network",
            "start_date": "Start Date",
            "end_date": "End Date",
            "closed": "Closed",
            "sold_out": "Sold Out",
            "active": "Active",
            "you_staked": "You Staked",
            "token_locked": "{{token}} Locked",
            "token_vesting_start": "{{token}} Vesting Start",
            "token_vesting_end": "{{token}} Vesting End",
            "claim_token_after_start": "Claim {{token}} after {{start}}",
            "token_claimable": "{{token}} Claimable",
            "stake_duration": "Stake Duration",
            "less_than_one_day": "< 1 Day",
            "duration_days": "{{duration}} Days",
            "get_token": "Get {{token}}",
            "view_contract": "View Contract",
            "view_reward_contract": "View Reward Contract",
            "you_earned": "You Earned",
        },
        "zh-hant": {
            "claim_token": "領取 {{token}}",
            "no_campaigns": "沒有活動",
            "switch_network": "切換網路",
            "start_date": "開始日期",
            "end_date": "結束日期",
            "closed": "已結束",
            "sold_out": "已售完",
            "active": "進行中",
            "you_staked": "您已質押",
            "token_locked": "{{token}} 鎖倉",
            "token_vesting_start": "{{token}} 解鎖開始",
            "token_vesting_end": "{{token}} 解鎖結束",
            "claim_token_after_start": "於 {{start}} 之後領取 {{token}}",
            "token_claimable": "{{token}} 可領取",
            "stake_duration": "質押期限",
            "less_than_one_day": "< 1 天",
            "duration_days": "{{duration}} 天",
            "get_token": "獲取 {{token}}",
            "view_contract": "查看合約",
            "view_reward_contract": "查看獎勳合約",
            "you_earned": "您已獲得",
        },
        "vi": {
            "claim_token": "Nhận {{token}}",
            "no_campaigns": "Không có chiến dịch",
            "switch_network": "Chuyển mạng",
            "start_date": "Ngày bắt đầu",
            "end_date": "Ngày kết thúc",
            "closed": "Đã đóng",
            "sold_out": "Hết hàng",
            "active": "Đang hoạt động",
            "you_staked": "Bạn đã đặt cược",
            "token_locked": "{{token}} đã khóa",
            "token_vesting_start": "Bắt đầu giải ngân {{token}}",
            "token_vesting_end": "Kết thúc giải ngân {{token}}",
            "claim_token_after_start": "Nhận {{token}} sau {{start}}",
            "token_claimable": "{{token}} có thể nhận được",
            "stake_duration": "Thời gian đặt cược",
            "less_than_one_day": "< 1 Ngày",
            "duration_days": "{{duration}} Ngày",
            "get_token": "Lấy {{token}}",
            "view_contract": "Xem hợp đồng",
            "view_reward_contract": "Xem hợp đồng thưởng",
            "you_earned": "Bạn đã kiếm được",
        }
    };
});
define("@scom/scom-staking/languages/index.ts", ["require", "exports", "@scom/scom-staking/languages/common.json.ts", "@scom/scom-staking/languages/setup.json.ts", "@scom/scom-staking/languages/stake.json.ts", "@scom/scom-staking/languages/main.json.ts"], function (require, exports, common_json_1, setup_json_1, stake_json_1, main_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mergeI18nData = exports.mainJson = exports.stakeJson = exports.setupJson = exports.commonJson = void 0;
    exports.commonJson = common_json_1.default;
    exports.setupJson = setup_json_1.default;
    exports.stakeJson = stake_json_1.default;
    exports.mainJson = main_json_1.default;
    function mergeI18nData(i18nData) {
        const mergedI18nData = {};
        for (let i = 0; i < i18nData.length; i++) {
            const i18nItem = i18nData[i];
            for (const key in i18nItem) {
                mergedI18nData[key] = { ...(mergedI18nData[key] || {}), ...(i18nItem[key] || {}) };
            }
        }
        return mergedI18nData;
    }
    exports.mergeI18nData = mergeI18nData;
});
define("@scom/scom-staking/manage-stake/index.tsx", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-staking/global/index.ts", "@scom/scom-staking/store/index.ts", "@scom/scom-token-list", "@scom/scom-staking/staking-utils/index.ts", "@scom/scom-staking/manage-stake/index.css.ts", "@scom/scom-staking/languages/index.ts"], function (require, exports, components_6, eth_wallet_5, index_5, index_6, scom_token_list_3, index_7, index_css_1, index_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_6.Styles.Theme.ThemeVars;
    ;
    let ManageStake = class ManageStake extends components_6.Module {
        constructor(parent, options) {
            super(parent, options);
            this.lockedTokenObject = {};
            this.maxQty = 0;
            this.availableQty = '0';
            this.balance = '0';
            this.perAddressCap = '0';
            this.stakeQty = '0';
            this.tokenSymbol = '';
            this.currentMode = index_5.CurrentMode.STAKE;
            this.tokenBalances = {};
            this.tokenMap = {};
            this.setData = async (data) => {
                this.address = data.address;
                this.stakingInfo = data;
                await this.onSetupPage();
            };
            this.setInputValue = (value) => {
                this.inputAmount.value = value;
                this.onInputAmount();
            };
            this.getBalance = () => {
                return eth_wallet_5.BigNumber.min(this.availableQty, this.balance, this.perAddressCap);
            };
            this.needToBeApproval = () => {
                return this.btnApprove && this.btnApprove.visible;
            };
            this.showMessage = (status, content) => {
                if (!this.txStatusModal)
                    return;
                let params = { status };
                if (status === 'success') {
                    params.txtHash = content;
                }
                else {
                    params.content = content;
                }
                this.txStatusModal.message = { ...params };
                this.txStatusModal.showModal();
            };
            this.onApproveToken = async () => {
                this.showMessage('warning', this.i18n.get('$approve_token', { token: this.tokenSymbol }));
                this.approvalModelAction.doApproveAction(this.lockedTokenObject, this.inputAmount.value);
            };
            this.onStake = async () => {
                this.currentMode = index_5.CurrentMode.STAKE;
                this.approvalModelAction.doPayAction();
            };
            this.onUnstake = () => {
                this.currentMode = index_5.CurrentMode.UNLOCK;
                this.approvalModelAction.doPayAction();
            };
            this.onInputAmount = () => {
                if (this.inputAmount.enabled === false)
                    return;
                this.currentMode = index_5.CurrentMode.STAKE;
                (0, index_5.limitInputNumber)(this.inputAmount, this.lockedTokenObject?.decimals || 18);
                if (this.state.isRpcWalletConnected())
                    this.approvalModelAction.checkAllowance(this.lockedTokenObject, this.inputAmount.value);
            };
            this.setMaxBalance = () => {
                this.currentMode = index_5.CurrentMode.STAKE;
                this.inputAmount.value = eth_wallet_5.BigNumber.min(this.availableQty, this.balance, this.perAddressCap).toFixed();
                (0, index_5.limitInputNumber)(this.inputAmount, this.lockedTokenObject?.decimals || 18);
                if (this.state.isRpcWalletConnected())
                    this.approvalModelAction.checkAllowance(this.lockedTokenObject, this.inputAmount.value);
            };
            this.renderStakingInfo = async (info) => {
                if (!info || !Object.keys(info).length) {
                    this.btnApprove.visible = false;
                    if (!this.state.isRpcWalletConnected()) {
                        this.btnMax.visible = false;
                        this.inputAmount.enabled = false;
                    }
                    return;
                }
                ;
                this.btnStake.id = `btn-stake-${this.address}`;
                this.btnUnstake.id = `btn-unstake-${this.address}`;
                let lpTokenData = {};
                let vaultTokenData = {};
                const rpcWallet = this.state.getRpcWallet();
                const { tokenAddress, lockTokenType, mode } = info;
                if (tokenAddress && mode === 'Stake') {
                    if (lockTokenType == index_5.LockTokenType.LP_Token) {
                        lpTokenData = {
                            'object': await (0, index_7.getLPObject)(rpcWallet, tokenAddress),
                            'balance': await (0, index_7.getLPBalance)(rpcWallet, tokenAddress)
                        };
                    }
                    else if (lockTokenType == index_5.LockTokenType.VAULT_Token) {
                        vaultTokenData = {
                            'object': await (0, index_7.getVaultObject)(rpcWallet, tokenAddress),
                            'balance': await (0, index_7.getVaultBalance)(rpcWallet, tokenAddress)
                        };
                    }
                }
                const tokenInfo = {
                    tokenAddress: tokenAddress,
                    lpToken: lpTokenData,
                    vaultToken: vaultTokenData
                };
                this.lockedTokenObject = (0, index_6.getLockedTokenObject)(info, tokenInfo, this.tokenMap);
                const defaultDecimalsOffset = 18 - (this.lockedTokenObject?.decimals || 18);
                const symbol = (0, index_6.getLockedTokenSymbol)(info, this.lockedTokenObject);
                this.tokenSymbol = symbol;
                this.perAddressCap = new eth_wallet_5.BigNumber(info.perAddressCap).shiftedBy(defaultDecimalsOffset).toFixed();
                this.maxQty = new eth_wallet_5.BigNumber(info.maxTotalLock).shiftedBy(defaultDecimalsOffset).toNumber();
                this.stakeQty = new eth_wallet_5.BigNumber(info.stakeQty).shiftedBy(defaultDecimalsOffset).toFixed();
                const totalLocked = new eth_wallet_5.BigNumber(info.totalLocked).shiftedBy(defaultDecimalsOffset);
                this.availableQty = new eth_wallet_5.BigNumber(this.maxQty).minus(totalLocked).toFixed();
                this.btnApprove.visible = false;
                // Unstake
                if (index_5.CurrentMode[mode.toUpperCase()] !== index_5.CurrentMode.STAKE) {
                    if (this.state.isRpcWalletConnected()) {
                        this.approvalModelAction.checkAllowance(this.lockedTokenObject, this.stakeQty);
                    }
                    this.btnStake.visible = false;
                    this.wrapperInputAmount.visible = false;
                    this.btnUnstake.visible = true;
                }
                else {
                    this.btnStake.visible = true;
                    this.wrapperInputAmount.visible = true;
                    this.btnUnstake.visible = false;
                }
                // Stake
                if (tokenAddress && mode === 'Stake') {
                    if (lockTokenType == index_5.LockTokenType.ERC20_Token) {
                        let balances = scom_token_list_3.tokenStore.getTokenBalancesByChainId(this.state.getChainId());
                        this.tokenBalances = Object.keys(balances).reduce((accumulator, key) => {
                            accumulator[key.toLowerCase()] = balances[key];
                            return accumulator;
                        }, {});
                        this.balance = this.tokenBalances[tokenAddress] || '0';
                    }
                    else if (lockTokenType == index_5.LockTokenType.LP_Token) {
                        this.balance = new eth_wallet_5.BigNumber(lpTokenData.balance || 0).shiftedBy(defaultDecimalsOffset).toFixed();
                    }
                    else if (lockTokenType == index_5.LockTokenType.VAULT_Token) {
                        this.balance = new eth_wallet_5.BigNumber(vaultTokenData.balance || 0).shiftedBy(defaultDecimalsOffset).toFixed();
                    }
                    this.btnMax.visible = true;
                    if (!this.lbToken.isConnected)
                        await this.lbToken.ready();
                    this.lbToken.caption = symbol;
                }
                await this.updateEnableInput();
                if (!this.state.isRpcWalletConnected()) {
                    this.btnMax.enabled = false;
                    this.inputAmount.enabled = false;
                }
            };
            this.onSetupPage = async () => {
                if (!(0, index_6.isClientWalletConnected)()) {
                    this.btnStake.enabled = false;
                    this.btnUnstake.enabled = false;
                    this.btnApprove.visible = false;
                    this.inputAmount.enabled = false;
                    this.renderStakingInfo(null);
                    return;
                }
                this.btnUnstake.enabled = true;
                this.tokenMap = scom_token_list_3.tokenStore.getTokenMapByChainId(this.state.getChainId());
                if (this.state.isRpcWalletConnected()) {
                    await this.initApprovalModelAction();
                }
                await this.ready();
                await this.renderStakingInfo(this.stakingInfo);
            };
            this.updateEnableInput = async () => {
                if (this.stakingInfo?.mode !== 'Stake')
                    return;
                const totalLocked = await (0, index_7.getStakingTotalLocked)(this.state.getRpcWallet(), this.address);
                const activeStartTime = this.stakingInfo.startOfEntryPeriod;
                const activeEndTime = this.stakingInfo.endOfEntryPeriod;
                const lockedTokenDecimals = this.lockedTokenObject?.decimals || 18;
                const defaultDecimalsOffset = 18 - lockedTokenDecimals;
                const optionQty = new eth_wallet_5.BigNumber(this.stakingInfo.maxTotalLock).minus(totalLocked).shiftedBy(defaultDecimalsOffset);
                const isStarted = (0, components_6.moment)(activeStartTime).diff((0, components_6.moment)()) <= 0;
                const isClosed = (0, components_6.moment)(activeEndTime).diff((0, components_6.moment)()) <= 0;
                const enabled = (isStarted && !(optionQty.lte(0) || isClosed));
                this.inputAmount.enabled = enabled;
                this.btnMax.enabled = enabled && new eth_wallet_5.BigNumber(this.balance).gt(0);
            };
            this.callback = (err) => {
                this.showMessage('error', err);
            };
        }
        set state(value) {
            this._state = value;
        }
        get state() {
            return this._state;
        }
        async initApprovalModelAction() {
            this.approvalModelAction = await this.state.setApprovalModelAction({
                sender: this,
                payAction: async () => {
                    this.showMessage('warning', this.i18n.get(this.currentMode === index_5.CurrentMode.STAKE ? '$stake_token' : '$unlock_token', { token: this.tokenSymbol }));
                    if (this.currentMode === index_5.CurrentMode.STAKE) {
                        (0, index_7.lockToken)(this.lockedTokenObject, this.inputAmount.value, this.address, this.callback);
                    }
                    else {
                        (0, index_7.withdrawToken)(this.address, this.callback);
                    }
                },
                onToBeApproved: async (token) => {
                    if (new eth_wallet_5.BigNumber(this.inputAmount.value).lte(eth_wallet_5.BigNumber.min(this.availableQty, this.balance, this.perAddressCap))) {
                        this.btnApprove.caption = this.i18n.get('$approve_token', { token: token.symbol });
                        this.btnApprove.visible = true;
                        this.btnApprove.enabled = true;
                    }
                    else {
                        this.btnApprove.visible = false;
                    }
                    this.btnStake.enabled = false;
                    this.btnUnstake.enabled = this.stakingInfo.mode !== 'Stake' && new eth_wallet_5.BigNumber(this.stakeQty).gt(0);
                },
                onToBePaid: async (token) => {
                    this.btnApprove.visible = false;
                    const isClosed = (0, components_6.moment)(this.stakingInfo?.endOfEntryPeriod || 0).diff((0, components_6.moment)()) <= 0;
                    if (this.currentMode === index_5.CurrentMode.STAKE) {
                        const amount = new eth_wallet_5.BigNumber(this.inputAmount.value);
                        if (amount.gt(this.balance)) {
                            this.btnStake.caption = this.i18n.get('$insufficient_balance');
                            this.btnStake.enabled = false;
                            return;
                        }
                        this.btnStake.caption = this.i18n.get('$stake');
                        if (amount.isNaN() || amount.lte(0) || amount.gt(eth_wallet_5.BigNumber.min(this.availableQty, this.balance, this.perAddressCap))) {
                            this.btnStake.enabled = false;
                        }
                        else {
                            this.btnStake.enabled = !isClosed;
                        }
                    }
                    this.btnUnstake.enabled = this.stakingInfo.mode !== 'Stake' && new eth_wallet_5.BigNumber(this.stakeQty).gt(0);
                },
                onApproving: async (token, receipt) => {
                    if (receipt) {
                        this.showMessage('success', receipt);
                        this.btnApprove.caption = this.i18n.get('$approving');
                        this.btnApprove.enabled = false;
                        this.btnApprove.rightIcon.visible = true;
                        this.btnMax.enabled = false;
                        this.inputAmount.enabled = false;
                    }
                },
                onApproved: async (token) => {
                    try {
                        await scom_token_list_3.tokenStore.updateNativeTokenBalanceByChainId(this.state.getChainId());
                    }
                    catch { }
                    await this.updateEnableInput();
                    this.btnApprove.rightIcon.visible = false;
                    this.btnApprove.visible = false;
                },
                onApprovingError: async (token, err) => {
                    this.showMessage('error', err);
                    this.btnApprove.rightIcon.visible = false;
                    this.btnMax.enabled = new eth_wallet_5.BigNumber(this.balance).gt(0);
                    this.inputAmount.enabled = true;
                },
                onPaying: async (receipt) => {
                    if (receipt) {
                        this.showMessage('success', receipt);
                        this.inputAmount.enabled = false;
                        this.btnMax.enabled = false;
                        if (this.currentMode === index_5.CurrentMode.STAKE) {
                            this.btnStake.caption = this.i18n.get('$staking');
                            this.btnStake.rightIcon.visible = true;
                            this.state.setStakingStatus(this.currentMode, true);
                            this.btnUnstake.enabled = false;
                        }
                        else {
                            this.btnUnstake.caption = this.i18n.get('$unstaking');
                            this.btnUnstake.rightIcon.visible = true;
                            this.state.setStakingStatus(this.currentMode, true);
                            this.btnStake.enabled = false;
                        }
                    }
                },
                onPaid: async (data, receipt) => {
                    if (this.onRefresh) {
                        const chainId = this.state.getChainId();
                        await scom_token_list_3.tokenStore.updateTokenBalancesByChainId(chainId);
                        await this.onRefresh();
                        this.state.setStakingStatus(this.currentMode, false);
                    }
                    if (this.currentMode === index_5.CurrentMode.STAKE) {
                        this.btnStake.caption = this.i18n.get('$stake');
                        this.btnStake.rightIcon.visible = false;
                        if (this.state.handleUpdateStepStatus) {
                            this.state.handleUpdateStepStatus({
                                status: this.i18n.get('$completed'),
                                color: Theme.colors.success.main
                            });
                        }
                        if (this.state.handleAddTransactions) {
                            let event = (0, index_7.parseDepositEvent)(this.state, receipt, this.address);
                            const timestamp = await this.state.getRpcWallet().getBlockTimestamp(receipt.blockNumber.toString());
                            const transactionsInfoArr = [
                                {
                                    desc: this.i18n.get('$stake_token', { token: this.lockedTokenObject.symbol }),
                                    fromToken: this.lockedTokenObject,
                                    toToken: null,
                                    fromTokenAmount: event.amount.toFixed(),
                                    toTokenAmount: '-',
                                    hash: receipt.transactionHash,
                                    timestamp
                                }
                            ];
                            this.state.handleAddTransactions({
                                list: transactionsInfoArr
                            });
                        }
                    }
                    else {
                        this.btnUnstake.caption = this.i18n.get('$unstake');
                        this.btnUnstake.rightIcon.visible = false;
                    }
                    await this.updateEnableInput();
                    this.inputAmount.value = '';
                    this.btnStake.enabled = false;
                    this.btnUnstake.enabled = this.stakingInfo.mode !== 'Stake' && new eth_wallet_5.BigNumber(this.stakeQty).gt(0);
                },
                onPayingError: async (err) => {
                    await this.updateEnableInput();
                    if (this.currentMode === index_5.CurrentMode.STAKE) {
                        this.btnStake.caption = this.i18n.get('$stake');
                        this.btnStake.rightIcon.visible = false;
                    }
                    else {
                        this.btnUnstake.caption = this.i18n.get('$unstake');
                        this.btnUnstake.rightIcon.visible = false;
                    }
                    this.showMessage('error', err);
                    this.state.setStakingStatus(this.currentMode, false);
                }
            });
            this.state.approvalModel.spenderAddress = this.address;
        }
        init() {
            this.i18n.init({ ...(0, index_8.mergeI18nData)([index_8.commonJson, index_8.stakeJson]) });
            super.init();
        }
        render() {
            return (this.$render("i-panel", { class: index_css_1.stakingManageStakeStyle },
                this.$render("i-hstack", { gap: 10, verticalAlignment: "center", horizontalAlignment: "center" },
                    this.$render("i-hstack", { id: "wrapperInputAmount", gap: 4, width: 280, height: 36, padding: { right: 8 }, background: { color: Theme.input.background }, border: { radius: 8 }, verticalAlignment: "center", horizontalAlignment: "space-between", stack: { shrink: '0' } },
                        this.$render("i-input", { id: "inputAmount", inputType: "number", placeholder: "0.0", width: "100%", height: "100%", border: { style: 'none' }, padding: { left: 8, right: 8 }, font: { size: '1rem' }, onChanged: () => this.onInputAmount() }),
                        this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                            this.$render("i-button", { id: "btnMax", caption: "$max", enabled: false, 
                                // background={{ color: `${Theme.colors.primary.main} !important` }}
                                // font={{ color: Theme.colors.primary.contrastText }}
                                font: { size: '1rem', color: '#fff', weight: 700 }, class: "btn-os", width: 45, minHeight: 25, onClick: () => this.setMaxBalance() }),
                            this.$render("i-label", { id: "lbToken", font: { size: '14px', color: Theme.input.fontColor }, opacity: 0.5 }))),
                    this.$render("i-hstack", { gap: 10, width: "100%", maxWidth: 370 },
                        this.$render("i-button", { id: "btnApprove", caption: "$approve", enabled: false, visible: false, width: "100%", minHeight: 36, border: { radius: 12 }, rightIcon: { spin: true, visible: false, fill: '#fff' }, 
                            // rightIcon={{ spin: true, visible: false, fill: Theme.colors.primary.contrastText }}
                            // background={{ color: `${Theme.colors.primary.main} !important` }}
                            // font={{ color: Theme.colors.primary.contrastText }}
                            font: { size: '1rem', color: '#fff', weight: 700 }, class: "btn-os", onClick: () => this.onApproveToken() }),
                        this.$render("i-button", { id: "btnStake", caption: "$stake", enabled: false, width: "100%", minHeight: 36, border: { radius: 12 }, rightIcon: { spin: true, visible: false, fill: '#fff' }, 
                            // rightIcon={{ spin: true, visible: false, fill: Theme.colors.primary.contrastText }}
                            // background={{ color: `${Theme.colors.primary.main} !important` }}
                            // font={{ color: Theme.colors.primary.contrastText }}
                            font: { size: '1rem', color: '#fff', weight: 700 }, class: "btn-os", onClick: () => this.onStake() }),
                        this.$render("i-button", { id: "btnUnstake", caption: "$unstake", enabled: false, width: "100%", minHeight: 36, border: { radius: 12 }, rightIcon: { spin: true, visible: false, fill: '#fff' }, 
                            // rightIcon={{ spin: true, visible: false, fill: Theme.colors.primary.contrastText }}
                            // background={{ color: `${Theme.colors.primary.main} !important` }}
                            font: { size: '1rem', color: '#fff', weight: 700 }, class: "btn-os", onClick: () => this.onUnstake() }))),
                this.$render("i-scom-tx-status-modal", { id: "txStatusModal" })));
        }
    };
    ManageStake = __decorate([
        (0, components_6.customElements)('staking-manage-stake')
    ], ManageStake);
    exports.default = ManageStake;
});
define("@scom/scom-staking/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stakingComponent = exports.stakingDappContainer = void 0;
    // import { maxWidth, maxHeight } from './store/index';
    const Theme = components_7.Styles.Theme.ThemeVars;
    // const colorVar = {
    //   primaryButton: 'transparent linear-gradient(90deg, #AC1D78 0%, #E04862 100%) 0% 0% no-repeat padding-box',
    //   primaryGradient: 'linear-gradient(255deg,#f15e61,#b52082)',
    //   primaryDisabled: 'transparent linear-gradient(270deg,#351f52,#552a42) 0% 0% no-repeat padding-box !important'
    // }
    exports.stakingDappContainer = components_7.Styles.style({
        $nest: {
            'dapp-container-body': {
                $nest: {
                    '&::-webkit-scrollbar': {
                        width: '6px',
                        height: '6px'
                    },
                    '&::-webkit-scrollbar-track': {
                        borderRadius: '10px',
                        border: '1px solid transparent',
                        background: `${Theme.divider} !important`
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: `${Theme.colors.primary.main} !important`,
                        borderRadius: '10px',
                        outline: '1px solid transparent'
                    }
                }
            }
        }
    });
    exports.stakingComponent = components_7.Styles.style({
        $nest: {
            '.btn-os': {
                background: 'var(--primary-button-background)',
                // height: 'auto !important',
                // color: '#fff',
                // color: Theme.colors.primary.contrastText,
                // fontSize: '1rem',
                // fontWeight: 'bold',
                transition: 'background .3s ease',
                boxShadow: 'none',
                $nest: {
                // 'i-icon.loading-icon': {
                //   marginInline: '0.25rem',
                //   width: '16px !important',
                //   height: '16px !important',
                // },
                // 'svg': {
                //   // fill: `${Theme.colors.primary.contrastText} !important`
                //   fill: `#fff !important`
                // }
                },
            },
            '.btn-os:not(.disabled):not(.is-spinning):hover, .btn-os:not(.disabled):not(.is-spinning):focus': {
                background: 'var(--primary-button-hover-background)',
                opacity: .9
            },
            '.btn-os:not(.disabled):not(.is-spinning):focus': {
                boxShadow: '0 0 0 0.2rem rgb(0 123 255 / 25%)'
            },
            '.btn-os.disabled, .btn-os.is-spinning': {
                background: 'var(--primary-button-disabled-background)',
                opacity: 1
            },
            '.wrapper': {
                $nest: {
                    '.sticker': {
                        transform: 'rotate(45deg)'
                    },
                    // '.bg-color': {
                    //   display: 'flex',
                    //   flexDirection: 'column',
                    //   color: '#fff',
                    //   minHeight: '485px',
                    //   height: '100%',
                    //   borderRadius: '15px',
                    //   paddingBottom: '1rem',
                    //   position: 'relative',
                    // }
                },
            },
            // '#loadingElm.i-loading--active': {
            //   marginTop: '2rem',
            //   position: 'initial',
            //   $nest: {
            //     '#stakingElm': {
            //       display: 'none !important',
            //     },
            //     '.i-loading-spinner': {
            //       marginTop: '2rem',
            //     },
            //   },
            // }
        }
    });
});
define("@scom/scom-staking/formSchema.ts", ["require", "exports", "@scom/scom-network-picker", "@scom/scom-staking/global/index.ts"], function (require, exports, scom_network_picker_1, index_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProjectOwnerSchema = void 0;
    const chainIds = [1, 56, 137, 250, 97, 80001, 43113, 43114];
    const theme = {
        type: 'object',
        properties: {
            backgroundColor: {
                type: 'string',
                format: 'color'
            },
            fontColor: {
                type: 'string',
                format: 'color'
            },
            textSecondary: {
                type: 'string',
                title: 'Campaign Font Color',
                format: 'color'
            },
            inputBackgroundColor: {
                type: 'string',
                format: 'color'
            },
            inputFontColor: {
                type: 'string',
                format: 'color'
            },
            secondaryColor: {
                type: 'string',
                title: 'Timer Background Color',
                format: 'color'
            },
            secondaryFontColor: {
                type: 'string',
                title: 'Timer Font Color',
                format: 'color'
            },
            primaryButtonBackground: {
                type: 'string',
                format: 'color'
            },
            primaryButtonHoverBackground: {
                type: 'string',
                format: 'color'
            },
            primaryButtonDisabledBackground: {
                type: 'string',
                format: 'color'
            }
        }
    };
    exports.default = {
        dataSchema: {
            type: 'object',
            properties: {
                chainId: {
                    type: 'number',
                    enum: chainIds,
                    required: true
                },
                name: {
                    type: 'string',
                    label: 'Campaign Name',
                    required: true
                },
                desc: {
                    type: 'string',
                    label: 'Campaign Description'
                },
                // logo: {
                //     type: 'string',
                //     title: 'Campaign Logo'
                // },
                getTokenURL: {
                    type: 'string',
                    title: 'Token Trade URL'
                },
                showContractLink: {
                    type: 'boolean'
                },
                staking: {
                    type: 'object',
                    properties: {
                        address: {
                            type: 'string',
                            required: true
                        },
                        lockTokenType: {
                            type: 'number',
                            oneOf: [
                                { title: 'ERC20_Token', const: index_9.LockTokenType.ERC20_Token },
                                { title: 'LP_Token', const: index_9.LockTokenType.LP_Token },
                                { title: 'VAULT_Token', const: index_9.LockTokenType.VAULT_Token },
                            ],
                            required: true
                        },
                        rewards: {
                            type: 'object',
                            properties: {
                                address: {
                                    type: 'string',
                                    required: true
                                },
                                isCommonStartDate: {
                                    type: 'boolean',
                                    title: 'Common Start Date'
                                }
                            }
                        }
                    }
                },
                dark: theme,
                light: theme
            }
        },
        uiSchema: {
            type: 'Categorization',
            elements: [
                {
                    type: 'Category',
                    label: 'General',
                    elements: [
                        {
                            type: 'VerticalLayout',
                            elements: [
                                {
                                    type: 'Control',
                                    scope: '#/properties/chainId'
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/name'
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/desc'
                                },
                                // {
                                //     type: 'Control',
                                //     scope: '#/properties/logo'
                                // },
                                {
                                    type: 'Control',
                                    scope: '#/properties/getTokenURL'
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/showContractLink'
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/staking'
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'Category',
                    label: 'Theme',
                    elements: [
                        {
                            type: 'VerticalLayout',
                            elements: [
                                {
                                    type: 'Group',
                                    label: 'Dark',
                                    elements: [
                                        {
                                            type: 'HorizontalLayout',
                                            elements: [
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/dark/properties/inputBackgroundColor'
                                                },
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/dark/properties/inputFontColor'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'HorizontalLayout',
                                            elements: [
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/dark/properties/secondaryColor'
                                                },
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/dark/properties/secondaryFontColor'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'HorizontalLayout',
                                            elements: [
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/dark/properties/primaryButtonBackground'
                                                },
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/dark/properties/primaryButtonHoverBackground'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'HorizontalLayout',
                                            elements: [
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/dark/properties/primaryButtonDisabledBackground'
                                                },
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/dark/properties/textSecondary'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'Group',
                                    label: 'Light',
                                    elements: [
                                        {
                                            type: 'HorizontalLayout',
                                            elements: [
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/light/properties/inputBackgroundColor'
                                                },
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/light/properties/inputFontColor'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'HorizontalLayout',
                                            elements: [
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/light/properties/secondaryColor'
                                                },
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/light/properties/secondaryFontColor'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'HorizontalLayout',
                                            elements: [
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/light/properties/primaryButtonBackground'
                                                },
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/light/properties/primaryButtonHoverBackground'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'HorizontalLayout',
                                            elements: [
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/light/properties/primaryButtonDisabledBackground'
                                                },
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/light/properties/textSecondary'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        customControls: {
            "#/properties/chainId": {
                render: () => {
                    const networkPicker = new scom_network_picker_1.default(undefined, {
                        type: 'combobox',
                        networks: chainIds.map(v => { return { chainId: v }; })
                    });
                    return networkPicker;
                },
                getData: (control) => {
                    return control.selectedNetwork?.chainId;
                },
                setData: async (control, value) => {
                    await control.ready();
                    control.setNetworkByChainId(value);
                }
            }
        }
    };
    function getProjectOwnerSchema() {
        return {
            dataSchema: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        label: 'Campaign Name',
                        required: true
                    },
                    desc: {
                        type: 'string',
                        label: 'Campaign Description'
                    },
                    // logo: {
                    //     type: 'string',
                    //     title: 'Campaign Logo'
                    // },
                    getTokenURL: {
                        type: 'string',
                        title: 'Token Trade URL'
                    },
                    showContractLink: {
                        type: 'boolean'
                    },
                    staking: {
                        type: 'object',
                        properties: {
                            address: {
                                type: 'string',
                                required: true
                            },
                            lockTokenType: {
                                type: 'number',
                                oneOf: [
                                    { title: 'ERC20_Token', const: index_9.LockTokenType.ERC20_Token },
                                    { title: 'LP_Token', const: index_9.LockTokenType.LP_Token },
                                    { title: 'VAULT_Token', const: index_9.LockTokenType.VAULT_Token },
                                ],
                                required: true
                            },
                            rewards: {
                                type: 'object',
                                properties: {
                                    address: {
                                        type: 'string',
                                        required: true
                                    },
                                    isCommonStartDate: {
                                        type: 'boolean',
                                        title: 'Common Start Date'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            uiSchema: {
                type: 'VerticalLayout',
                elements: [
                    {
                        type: 'Control',
                        scope: '#/properties/name'
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/desc'
                    },
                    // {
                    //     type: 'Control',
                    //     scope: '#/properties/logo'
                    // },
                    {
                        type: 'Control',
                        scope: '#/properties/getTokenURL'
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/showContractLink'
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/staking'
                    }
                ]
            }
        };
    }
    exports.getProjectOwnerSchema = getProjectOwnerSchema;
});
define("@scom/scom-staking/flow/initialSetup.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-token-list", "@scom/scom-staking/store/index.ts", "@ijstech/eth-wallet", "@scom/scom-staking/languages/index.ts"], function (require, exports, components_8, scom_token_list_4, index_10, eth_wallet_6, index_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_8.Styles.Theme.ThemeVars;
    let ScomStakingFlowInitialSetup = class ScomStakingFlowInitialSetup extends components_8.Module {
        constructor() {
            super(...arguments);
            this.walletEvents = [];
            this.initWallet = async () => {
                try {
                    const rpcWallet = this.rpcWallet;
                    await rpcWallet.init();
                }
                catch (err) {
                    console.log(err);
                }
            };
            this.initializeWidgetConfig = async () => {
                let connected = (0, index_10.isClientWalletConnected)();
                this.displayWalletStatus(connected);
                await this.initWallet();
                scom_token_list_4.tokenStore.updateTokenMapData(this.executionProperties.chainId);
                let tokenAddress = this.tokenRequirements[0].tokenOut.address?.toLowerCase();
                this.tokenInput.chainId = this.executionProperties.chainId;
                const tokenMap = scom_token_list_4.tokenStore.getTokenMapByChainId(this.executionProperties.chainId);
                const token = tokenMap[tokenAddress];
                this.tokenInput.tokenDataListProp = [token];
                this.tokenInput.token = token;
            };
            this.handleClickStart = async () => {
                this.tokenInput.readOnly = true;
                this.tokenRequirements[0].tokenOut.amount = this.tokenInput.value;
                this.executionProperties.stakeInputValue = this.tokenInput.value;
                if (this.state.handleUpdateStepStatus) {
                    this.state.handleUpdateStepStatus({
                        status: this.i18n.get('$completed'),
                        color: Theme.colors.success.main
                    });
                }
                if (this.state.handleNextFlowStep) {
                    this.state.handleNextFlowStep({
                        isInitialSetup: true,
                        amount: this.tokenInput.value,
                        tokenRequirements: this.tokenRequirements,
                        executionProperties: this.executionProperties
                    });
                }
            };
        }
        set state(value) {
            this._state = value;
        }
        get state() {
            return this._state;
        }
        get rpcWallet() {
            return this.state.getRpcWallet();
        }
        async resetRpcWallet() {
            const rpcWalletId = await this.state.initRpcWallet(this.executionProperties.chainId);
            const rpcWallet = this.rpcWallet;
        }
        async setData(value) {
            this.executionProperties = value.executionProperties;
            this.tokenRequirements = value.tokenRequirements;
            await this.resetRpcWallet();
            await this.initializeWidgetConfig();
        }
        async connectWallet() {
            if (!(0, index_10.isClientWalletConnected)()) {
                if (this.mdWallet) {
                    await components_8.application.loadPackage('@scom/scom-wallet-modal', '*');
                    this.mdWallet.networks = this.executionProperties.networks;
                    this.mdWallet.wallets = this.executionProperties.wallets;
                    this.mdWallet.showModal();
                }
            }
        }
        displayWalletStatus(connected) {
            if (connected) {
                this.lbConnectedStatus.caption = this.i18n.get('$connected_with_address', { address: eth_wallet_6.Wallet.getClientInstance().address });
                this.btnConnectWallet.visible = false;
            }
            else {
                this.lbConnectedStatus.caption = this.i18n.get('$please_connect_with_your_wallet');
                this.btnConnectWallet.visible = true;
            }
        }
        registerEvents() {
            let clientWallet = eth_wallet_6.Wallet.getClientInstance();
            this.walletEvents.push(clientWallet.registerWalletEvent(this, eth_wallet_6.Constants.ClientWalletEvent.AccountsChanged, async (payload) => {
                const { userTriggeredConnect, account } = payload;
                let connected = !!account;
                this.displayWalletStatus(connected);
            }));
        }
        onHide() {
            let clientWallet = eth_wallet_6.Wallet.getClientInstance();
            for (let event of this.walletEvents) {
                clientWallet.unregisterWalletEvent(event);
            }
            this.walletEvents = [];
        }
        init() {
            this.i18n.init({ ...(0, index_11.mergeI18nData)([index_11.commonJson, index_11.setupJson]) });
            super.init();
            this.tokenInput.style.setProperty('--input-background', '#232B5A');
            this.tokenInput.style.setProperty('--input-font_color', '#fff');
            this.registerEvents();
        }
        render() {
            return (this.$render("i-vstack", { gap: '1rem', padding: { top: 10, bottom: 10, left: 20, right: 20 } },
                this.$render("i-label", { caption: "$get_ready_to_stake", font: { size: '1.5rem' } }),
                this.$render("i-vstack", { gap: '1rem' },
                    this.$render("i-label", { id: "lbConnectedStatus" }),
                    this.$render("i-hstack", null,
                        this.$render("i-button", { id: "btnConnectWallet", caption: "$connect_wallet", font: { color: Theme.colors.primary.contrastText }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }, onClick: this.connectWallet })),
                    this.$render("i-label", { caption: "$how_many_tokens_are_you_planning_to_stake" }),
                    this.$render("i-hstack", { verticalAlignment: 'center', width: '50%' },
                        this.$render("i-scom-token-input", { id: "tokenInput", placeholder: '0.0', value: '-', tokenReadOnly: true, isBalanceShown: false, isBtnMaxShown: false, border: { radius: '1rem' }, font: { size: '1.25rem' }, background: { color: Theme.input.background } })),
                    this.$render("i-hstack", { horizontalAlignment: 'center' },
                        this.$render("i-button", { id: "btnStart", caption: "$start", padding: { top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }, font: { color: Theme.colors.primary.contrastText, size: '1.5rem' }, onClick: this.handleClickStart }))),
                this.$render("i-scom-wallet-modal", { id: "mdWallet", wallets: [] })));
        }
        async handleFlowStage(target, stage, options) {
            let self = this;
            if (!options.isWidgetConnected) {
                let properties = options.properties;
                let tokenRequirements = options.tokenRequirements;
                this.state.handleNextFlowStep = options.onNextStep;
                this.state.handleAddTransactions = options.onAddTransactions;
                this.state.handleJumpToStep = options.onJumpToStep;
                this.state.handleUpdateStepStatus = options.onUpdateStepStatus;
                await this.setData({
                    executionProperties: properties,
                    tokenRequirements
                });
            }
            return {
                widget: self
            };
        }
    };
    ScomStakingFlowInitialSetup = __decorate([
        components_8.customModule,
        (0, components_8.customElements)('i-scom-staking-flow-initial-setup')
    ], ScomStakingFlowInitialSetup);
    exports.default = ScomStakingFlowInitialSetup;
});
define("@scom/scom-staking", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-staking/assets.ts", "@scom/scom-staking/global/index.ts", "@scom/scom-staking/store/index.ts", "@scom/scom-token-list", "@scom/scom-staking/data.json.ts", "@scom/scom-staking/staking-utils/index.ts", "@scom/scom-staking/manage-stake/index.tsx", "@scom/scom-staking/index.css.ts", "@scom/scom-dapp-container", "@scom/scom-staking/formSchema.ts", "@scom/scom-staking/flow/initialSetup.tsx", "@scom/scom-blocknote-sdk", "@scom/scom-staking/languages/index.ts"], function (require, exports, components_9, eth_wallet_7, assets_2, index_12, index_13, scom_token_list_5, data_json_1, index_14, index_15, index_css_2, scom_dapp_container_1, formSchema_1, initialSetup_1, scom_blocknote_sdk_1, index_16) {
    "use strict";
    var ScomStaking_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_9.Styles.Theme.ThemeVars;
    const letterSpacing = '0.15px';
    let ScomStaking = ScomStaking_1 = class ScomStaking extends components_9.Module {
        addBlock(blocknote, executeFn, callbackFn) {
            const moduleData = {
                name: '@scom/scom-staking',
                localPath: 'scom-staking'
            };
            const blockType = 'staking';
            const stakingRegex = /https:\/\/widget.noto.fan\/(#!\/)?scom\/scom-staking\/\S+/g;
            function getData(href) {
                const widgetData = (0, scom_blocknote_sdk_1.parseUrl)(href);
                if (widgetData) {
                    const { module, properties } = widgetData;
                    if (module.localPath === moduleData.localPath)
                        return { ...properties };
                }
                return false;
            }
            const StakingBlock = blocknote.createBlockSpec({
                type: blockType,
                propSchema: {
                    ...blocknote.defaultProps,
                    chainId: { default: 0 },
                    name: { default: '' },
                    desc: { default: '' },
                    logo: { default: '' },
                    getTokenURL: { default: '' },
                    showContractLink: { default: false },
                    staking: { default: null },
                    stakeInputValue: { default: '' },
                    commissions: { default: [] },
                    wallets: { default: [] },
                    networks: { default: [] },
                },
                content: "none"
            }, {
                render: (block) => {
                    const wrapper = new components_9.Panel();
                    const props = JSON.parse(JSON.stringify(block.props));
                    const customElm = new ScomStaking_1(wrapper, { ...props });
                    if (typeof callbackFn === 'function') {
                        callbackFn(customElm, block);
                    }
                    wrapper.appendChild(customElm);
                    return {
                        dom: wrapper
                    };
                },
                parseFn: () => {
                    return [
                        {
                            tag: `div[data-content-type=${blockType}]`,
                            node: blockType
                        },
                        {
                            tag: "a",
                            getAttrs: (element) => {
                                if (typeof element === "string") {
                                    return false;
                                }
                                const href = element.getAttribute('href');
                                if (href)
                                    return getData(href);
                                return false;
                            },
                            priority: 408,
                            node: blockType
                        },
                        {
                            tag: "p",
                            getAttrs: (element) => {
                                if (typeof element === "string") {
                                    return false;
                                }
                                const child = element.firstChild;
                                if (child?.nodeName === 'A' && child.getAttribute('href')) {
                                    const href = child.getAttribute('href');
                                    return getData(href);
                                }
                                return false;
                            },
                            priority: 409,
                            node: blockType
                        }
                    ];
                },
                toExternalHTML: (block, editor) => {
                    const link = document.createElement("a");
                    const url = (0, scom_blocknote_sdk_1.getWidgetEmbedUrl)({
                        type: blockType,
                        props: { ...(block.props || {}) }
                    }, moduleData);
                    link.setAttribute("href", url);
                    link.textContent = blockType;
                    const wrapper = document.createElement("p");
                    wrapper.appendChild(link);
                    return { dom: wrapper };
                },
                pasteRules: [
                    {
                        find: stakingRegex,
                        handler(props) {
                            const { state, chain, range } = props;
                            const textContent = state.doc.resolve(range.from).nodeAfter?.textContent;
                            const widgetData = (0, scom_blocknote_sdk_1.parseUrl)(textContent);
                            if (!widgetData)
                                return null;
                            const { properties } = widgetData;
                            chain().BNUpdateBlock(state.selection.from, {
                                type: blockType,
                                props: {
                                    ...properties
                                },
                            }).setTextSelection(range.from + 1);
                        }
                    }
                ]
            });
            const StakingSlashItem = {
                name: "Staking",
                execute: (editor) => {
                    const block = {
                        type: blockType,
                        props: data_json_1.default.defaultBuilderData
                    };
                    if (typeof executeFn === 'function') {
                        executeFn(editor, block);
                    }
                },
                aliases: [blockType, "widget"],
                group: "Widget",
                icon: { name: 'hand-holding-usd' },
                hint: "Insert a staking widget"
            };
            return {
                block: StakingBlock,
                slashItem: StakingSlashItem,
                moduleData
            };
        }
        _getActions(category) {
            const actions = [];
            if (category !== 'offers') {
                actions.push({
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = {
                            chainId: 0,
                            name: '',
                            staking: undefined,
                            wallets: [],
                            networks: []
                        };
                        let oldTag = {};
                        return {
                            execute: async () => {
                                oldData = JSON.parse(JSON.stringify(this._data));
                                const { chainId, name, desc, logo, getTokenURL, showContractLink, staking, ...themeSettings } = userInputData;
                                const generalSettings = {
                                    chainId,
                                    name,
                                    desc,
                                    logo,
                                    getTokenURL,
                                    showContractLink,
                                    staking
                                };
                                if (generalSettings.chainId !== undefined)
                                    this._data.chainId = generalSettings.chainId;
                                if (generalSettings.name !== undefined)
                                    this._data.name = generalSettings.name;
                                if (generalSettings.desc !== undefined)
                                    this._data.desc = generalSettings.desc;
                                if (generalSettings.logo !== undefined)
                                    this._data.logo = generalSettings.logo;
                                if (generalSettings.getTokenURL !== undefined)
                                    this._data.getTokenURL = generalSettings.getTokenURL;
                                if (generalSettings.showContractLink !== undefined)
                                    this._data.showContractLink = generalSettings.showContractLink;
                                if (generalSettings.staking !== undefined)
                                    this._data.staking = generalSettings.staking;
                                await this.resetRpcWallet();
                                this.refreshUI();
                                if (builder?.setData)
                                    builder.setData(this._data);
                                oldTag = JSON.parse(JSON.stringify(this.tag));
                                if (builder)
                                    builder.setTag(themeSettings);
                                else
                                    this.setTag(themeSettings);
                                if (this.dappContainer)
                                    this.dappContainer.setTag(themeSettings);
                            },
                            undo: async () => {
                                this._data = JSON.parse(JSON.stringify(oldData));
                                this.refreshUI();
                                if (builder?.setData)
                                    builder.setData(this._data);
                                this.tag = JSON.parse(JSON.stringify(oldTag));
                                if (builder)
                                    builder.setTag(this.tag);
                                else
                                    this.setTag(this.tag);
                                if (this.dappContainer)
                                    this.dappContainer.setTag(userInputData);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: formSchema_1.default.dataSchema,
                    userInputUISchema: formSchema_1.default.uiSchema,
                    customControls: formSchema_1.default.customControls
                });
            }
            return actions;
        }
        getProjectOwnerActions() {
            const formSchema = (0, formSchema_1.getProjectOwnerSchema)();
            const actions = [
                {
                    name: 'Settings',
                    userInputDataSchema: formSchema.dataSchema,
                    userInputUISchema: formSchema.uiSchema
                }
            ];
            return actions;
        }
        getConfigurators() {
            let self = this;
            return [
                {
                    name: 'Project Owner Configurator',
                    target: 'Project Owners',
                    getProxySelectors: async (chainId) => {
                        const address = this.campaign?.option?.[0]?.address;
                        const selectors = await (0, index_14.getProxySelectors)(this.state, chainId, address);
                        return selectors;
                    },
                    getActions: () => {
                        return this.getProjectOwnerActions();
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        await this.setData(data);
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: (category) => {
                        return this._getActions(category);
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        const defaultData = data_json_1.default.defaultBuilderData;
                        await this.setData({ ...defaultData, ...data });
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Emdedder Configurator',
                    target: 'Embedders',
                    elementName: 'i-scom-commission-fee-setup',
                    getLinkParams: () => {
                        const commissions = this._data.commissions || [];
                        return {
                            data: window.btoa(JSON.stringify(commissions))
                        };
                    },
                    setLinkParams: async (params) => {
                        if (params.data) {
                            const decodedString = window.atob(params.data);
                            const commissions = JSON.parse(decodedString);
                            let resultingData = {
                                ...self._data,
                                commissions
                            };
                            await this.setData(resultingData);
                        }
                    },
                    bindOnChanged: (element, callback) => {
                        element.onChanged = async (data) => {
                            let resultingData = {
                                ...self._data,
                                ...data
                            };
                            await this.setData(resultingData);
                            await callback(data);
                        };
                    },
                    getData: () => {
                        const fee = this.state.embedderCommissionFee;
                        return { ...this.getData(), fee };
                    },
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Editor',
                    target: 'Editor',
                    getActions: (category) => {
                        const actions = this._getActions(category);
                        const editAction = actions.find(action => action.name === 'Edit');
                        return editAction ? [editAction] : [];
                    },
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        async getData() {
            return this._data;
        }
        async resetRpcWallet() {
            this.removeRpcWalletEvents();
            const rpcWalletId = await this.state.initRpcWallet(this.chainId);
            const rpcWallet = this.rpcWallet;
            const chainChangedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_7.Constants.RpcWalletEvent.ChainChanged, async (chainId) => {
                this.onChainChanged();
            });
            const connectedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_7.Constants.RpcWalletEvent.Connected, async (connected) => {
                this.initializeWidgetConfig();
            });
            this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
            const data = {
                defaultChainId: this.chainId,
                wallets: this.wallets,
                networks: this.networks.length ? this.networks : [{ chainId: this.chainId }],
                showHeader: this.showHeader,
                rpcWalletId: rpcWallet.instanceId,
                widgetType: this.widgetType
            };
            if (this.dappContainer?.setData)
                this.dappContainer.setData(data);
            // TODO - update proxy address
        }
        async setData(value) {
            this._data = value;
            await this.resetRpcWallet();
            this.initializeWidgetConfig();
        }
        async getTag() {
            return this.tag;
        }
        updateTag(type, value) {
            this.tag[type] = this.tag[type] ?? {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.tag[type][prop] = value[prop];
            }
        }
        async setTag(value) {
            const newValue = value || {};
            for (let prop in newValue) {
                if (newValue.hasOwnProperty(prop)) {
                    if (prop === 'light' || prop === 'dark')
                        this.updateTag(prop, newValue[prop]);
                    else
                        this.tag[prop] = newValue[prop];
                }
            }
            if (this.dappContainer)
                this.dappContainer.setTag(this.tag);
            this.updateTheme();
        }
        updateStyle(name, value) {
            value ?
                this.style.setProperty(name, value) :
                this.style.removeProperty(name);
        }
        updateTheme() {
            const themeVar = this.dappContainer?.theme || 'light';
            this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
            this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
            this.updateStyle('--text-secondary', this.tag[themeVar]?.textSecondary);
            this.updateStyle('--colors-secondary-main', this.tag[themeVar]?.secondaryColor);
            this.updateStyle('--colors-secondary-contrast_text', this.tag[themeVar]?.secondaryFontColor);
            this.updateStyle('--input-font_color', this.tag[themeVar]?.inputFontColor);
            this.updateStyle('--input-background', this.tag[themeVar]?.inputBackgroundColor);
            this.updateStyle('--primary-button-background', this.tag[themeVar]?.primaryButtonBackground || 'transparent linear-gradient(90deg, #AC1D78 0%, #E04862 100%) 0% 0% no-repeat padding-box');
            this.updateStyle('--primary-button-hover-background', this.tag[themeVar]?.primaryButtonHoverBackground || 'linear-gradient(255deg,#f15e61,#b52082)');
            this.updateStyle('--primary-button-disabled-background', this.tag[themeVar]?.primaryButtonDisabledBackground || 'transparent linear-gradient(270deg,#351f52,#552a42) 0% 0% no-repeat padding-box');
        }
        get wallets() {
            return this._data.wallets ?? [];
        }
        set wallets(value) {
            this._data.wallets = value;
        }
        get networks() {
            return this._data.networks ?? [];
        }
        set networks(value) {
            this._data.networks = value;
        }
        get showHeader() {
            return this._data.showHeader ?? true;
        }
        set showHeader(value) {
            this._data.showHeader = value;
        }
        get showSwapTokenLink() {
            return this._data.showSwapTokenLink ?? true;
        }
        set showSwapTokenLink(value) {
            this._data.showSwapTokenLink = value;
        }
        get showRewardsInStakeMode() {
            return this._data.showRewardsInStakeMode ?? true;
        }
        set showRewardsInStakeMode(value) {
            this._data.showRewardsInStakeMode = value;
        }
        get widgetType() {
            return this._widgetType;
        }
        set widgetType(value) {
            this._widgetType = value;
        }
        get hideDate() {
            return this._hideDate;
        }
        set hideDate(value) {
            this._hideDate = value;
        }
        get chainId() {
            return this._data.chainId;
        }
        get rpcWallet() {
            return this.state.getRpcWallet();
        }
        constructor(parent, options) {
            super(parent, options);
            this.tag = {};
            this.defaultEdit = true;
            this.listAprTimer = [];
            this.tokenMap = {};
            this._widgetType = scom_dapp_container_1.WidgetType.Standalone;
            this._hideDate = false;
            this.rpcWalletEvents = [];
            this.onChainChanged = async () => {
                this.initializeWidgetConfig();
            };
            this.refreshUI = () => {
                this.initializeWidgetConfig();
            };
            this.initializeWidgetConfig = (hideLoading) => {
                setTimeout(async () => {
                    if (!hideLoading && this.loadingElm) {
                        this.loadingElm.visible = true;
                    }
                    if (!(0, index_13.isClientWalletConnected)() || !this._data || !this.checkValidation()) {
                        await this.renderEmpty();
                        return;
                    }
                    await this.initWallet();
                    scom_token_list_5.tokenStore.updateTokenMapData(this.chainId);
                    await scom_token_list_5.tokenStore.updateTokenBalancesByChainId(this.chainId);
                    this.campaign = await (0, index_14.getCampaignInfo)(this.rpcWallet, { [this._data.chainId]: this._data });
                    await this.renderCampaign(hideLoading);
                    if (!hideLoading && this.loadingElm) {
                        this.loadingElm.visible = false;
                    }
                });
            };
            this.initWallet = async () => {
                try {
                    await eth_wallet_7.Wallet.getClientInstance().init();
                    const rpcWallet = this.rpcWallet;
                    await rpcWallet.init();
                }
                catch (err) {
                    console.log(err);
                }
            };
            this.showMessage = (status, content) => {
                if (!this.txStatusModal)
                    return;
                let params = { status };
                if (status === 'success') {
                    params.txtHash = content;
                }
                else {
                    params.content = content;
                }
                this.txStatusModal.message = { ...params };
                this.txStatusModal.showModal();
            };
            this.onClaim = async (btnClaim, data) => {
                this.showMessage('warning', this.i18n.get('$claim', { token: data.rewardSymbol }));
                const callBack = async (err, reply) => {
                    if (err) {
                        this.showMessage('error', err);
                    }
                    else {
                        this.showMessage('success', reply);
                        btnClaim.enabled = false;
                        btnClaim.rightIcon.visible = true;
                    }
                };
                const confirmationCallBack = async (receipt) => {
                    this.initializeWidgetConfig(true);
                    if (!btnClaim)
                        return;
                    btnClaim.rightIcon.visible = false;
                    btnClaim.enabled = true;
                };
                (0, index_12.registerSendTxEvents)({
                    transactionHash: callBack,
                    confirmation: confirmationCallBack
                });
                (0, index_14.claimToken)(data.reward.address, callBack);
            };
            this.checkValidation = () => {
                if (!this._data)
                    return false;
                const { chainId, name, staking } = this._data;
                if (!chainId || !name || !staking)
                    return false;
                const { address, rewards, lockTokenType } = staking;
                if (!address || !rewards || !rewards.address || lockTokenType === undefined)
                    return false;
                // const { chainId, customName, campaignStart, campaignEnd, admin, staking } = this._data;
                // if (!chainId || !customName || !campaignStart?.gt(0) || !campaignEnd?.gt(0) || !admin || !staking) return false;
                // const { lockTokenAddress, minLockTime, perAddressCap, maxTotalLock, rewards } = staking;
                // if (!lockTokenAddress || !minLockTime?.gt(0) || !perAddressCap?.gt(0) || !maxTotalLock?.gt(0) || !rewards) return false;
                // const { rewardTokenAddress, multiplier, initialReward, vestingPeriod, claimDeadline } = rewards[0];
                // if (!rewardTokenAddress || !multiplier?.gt(0) || initialReward?.isNaN() || !vestingPeriod?.gt(0) || !claimDeadline) return false;
                return true;
            };
            this.removeTimer = () => {
                for (const timer of this.listAprTimer) {
                    clearInterval(timer);
                }
                this.listAprTimer = [];
                clearInterval(this.activeTimer);
            };
            this.getRewardToken = (tokenAddress) => {
                return this.tokenMap[tokenAddress] || this.tokenMap[tokenAddress?.toLocaleLowerCase()] || {};
            };
            this.getLPToken = (campaign, token, chainId) => {
                if (campaign.getTokenURL) {
                    window.open(campaign.getTokenURL);
                }
                else {
                    window.open(index_13.getTokenUrl ? index_13.getTokenUrl : `https:openswap.xyz/#/swap?chainId=${chainId}&fromToken=BNB&toToken=${token}&fromAmount=1&showOptimizedRoutes=false`);
                }
            };
            this.connectWallet = async () => {
                if (!(0, index_13.isClientWalletConnected)()) {
                    if (this.mdWallet) {
                        await components_9.application.loadPackage('@scom/scom-wallet-modal', '*');
                        this.mdWallet.networks = this.networks;
                        this.mdWallet.wallets = this.wallets;
                        this.mdWallet.showModal();
                    }
                    return;
                }
                if (!this.state.isRpcWalletConnected()) {
                    const clientWallet = eth_wallet_7.Wallet.getClientInstance();
                    await clientWallet.switchNetwork(this.chainId);
                }
            };
            this.initEmptyUI = async () => {
                if (!this.noCampaignSection) {
                    this.noCampaignSection = await components_9.Panel.create({ height: '100%' });
                }
                const isClientConnected = (0, index_13.isClientWalletConnected)();
                // const isRpcConnected = this.state.isRpcWalletConnected();
                this.noCampaignSection.clearInnerHTML();
                this.noCampaignSection.appendChild(this.$render("i-vstack", { height: "100%", background: { color: Theme.background.main }, padding: { top: '3rem', bottom: '3rem', left: '2rem', right: '2rem' }, justifyContent: 'center', class: "no-campaign text-center" },
                    this.$render("i-vstack", { verticalAlignment: "center", gap: "1rem", width: "100%", height: "100%" },
                        this.$render("i-image", { width: "100%", height: "100%", url: assets_2.default.fullPath('img/staking/TrollTrooper.svg') }),
                        this.$render("i-label", { caption: this.i18n.get(isClientConnected ? '$no_campaigns' : '$please_connect_with_your_wallet'), font: { size: '1.5rem' }, letterSpacing: letterSpacing }))));
                this.noCampaignSection.visible = true;
            };
            this.renderEmpty = async () => {
                await this.initEmptyUI();
                if (this.stakingElm) {
                    this.stakingElm.clearInnerHTML();
                    this.stakingElm.appendChild(this.noCampaignSection);
                }
                if (this.loadingElm) {
                    this.loadingElm.visible = false;
                }
            };
            this.renderCampaign = async (hideLoading) => {
                if (!hideLoading) {
                    this.stakingElm.clearInnerHTML();
                }
                this.tokenMap = scom_token_list_5.tokenStore.getTokenMapByChainId(this.chainId);
                const chainId = this.state.getChainId();
                await this.initEmptyUI();
                this.noCampaignSection.visible = false;
                if (!this.campaign) {
                    this.stakingElm.clearInnerHTML();
                    this.stakingElm.appendChild(this.noCampaignSection);
                    this.noCampaignSection.visible = true;
                    this.removeTimer();
                    return;
                }
                const rpcWalletConnected = this.state.isRpcWalletConnected();
                const rpcWallet = this.rpcWallet;
                this.removeTimer();
                const campaign = this.campaign;
                const containerSection = await components_9.Panel.create();
                // containerSection.classList.add('container');
                let opt = { ...campaign.option };
                let lpTokenData = {};
                let vaultTokenData = {};
                if (opt.tokenAddress) {
                    if (opt.lockTokenType == index_12.LockTokenType.LP_Token) {
                        lpTokenData = {
                            'object': await (0, index_14.getLPObject)(rpcWallet, opt.tokenAddress)
                        };
                    }
                    else if (opt.lockTokenType == index_12.LockTokenType.VAULT_Token) {
                        vaultTokenData = {
                            'object': await (0, index_14.getVaultObject)(rpcWallet, opt.tokenAddress)
                        };
                    }
                }
                const tokenInfo = {
                    tokenAddress: campaign.tokenAddress,
                    lpToken: lpTokenData,
                    vaultToken: vaultTokenData
                };
                opt = {
                    ...opt,
                    tokenInfo
                };
                const stakingInfo = opt;
                const lockedTokenObject = (0, index_13.getLockedTokenObject)(stakingInfo, stakingInfo.tokenInfo, this.tokenMap);
                const lockedTokenSymbol = (0, index_13.getLockedTokenSymbol)(stakingInfo, lockedTokenObject);
                const lockedTokenIconPaths = (0, index_13.getLockedTokenIconPaths)(stakingInfo, lockedTokenObject, chainId, this.tokenMap);
                const lockedTokenDecimals = lockedTokenObject?.decimals || 18;
                const defaultDecimalsOffset = 18 - lockedTokenDecimals;
                const activeStartTime = stakingInfo ? stakingInfo.startOfEntryPeriod : 0;
                const activeEndTime = stakingInfo ? stakingInfo.endOfEntryPeriod : 0;
                let isStarted = (0, components_9.moment)(activeStartTime).diff((0, components_9.moment)()) <= 0;
                let isClosed = (0, components_9.moment)(activeEndTime).diff((0, components_9.moment)()) <= 0;
                let totalLocked = {};
                const optionTimer = {
                    background: { color: Theme.colors.secondary.main },
                    font: { color: Theme.colors.secondary.contrastText, size: '0.875rem' },
                    padding: { left: '4px', right: '4px' },
                    border: { radius: 4 },
                    minWidth: 20,
                    height: 20,
                    lineHeight: '1.25rem',
                    letterSpacing
                };
                const stakingElm = await components_9.VStack.create({ width: '100%' });
                const activeTimerRow = await components_9.VStack.create({ gap: 2, width: '25%', verticalAlignment: 'center', visible: !this.hideDate });
                const activeTimerElm = await components_9.VStack.create();
                activeTimerRow.appendChild(this.$render("i-label", { caption: "$end_date", font: { size: '0.875rem' }, opacity: 0.5, letterSpacing: letterSpacing }));
                activeTimerRow.appendChild(activeTimerElm);
                const endHour = await components_9.Label.create(optionTimer);
                const endDay = await components_9.Label.create(optionTimer);
                const endMin = await components_9.Label.create(optionTimer);
                activeTimerElm.appendChild(this.$render("i-hstack", { gap: 4 },
                    endDay,
                    this.$render("i-label", { caption: "D", lineHeight: '1.25rem', font: { size: '0.875rem' }, letterSpacing: letterSpacing }),
                    endHour,
                    this.$render("i-label", { caption: "H", lineHeight: '1.25rem', font: { size: '0.875rem' }, letterSpacing: letterSpacing }),
                    endMin,
                    this.$render("i-label", { caption: "M", lineHeight: '1.25rem', font: { size: '0.875rem' }, letterSpacing: letterSpacing })));
                // Sticker
                const stickerSection = await components_9.VStack.create({
                    visible: false,
                    position: 'absolute',
                    top: '-8px',
                    right: '-33px',
                    border: {
                        left: { width: '50px', style: 'solid', color: 'transparent' },
                        right: { width: '50px', style: 'solid', color: 'transparent' },
                        bottom: { width: '50px', style: 'solid', color: '#20bf55' }
                    }
                });
                const stickerLabel = await components_9.Label.create({
                    display: 'flex',
                    font: { size: '0.75rem', color: '#3f3f42' },
                    grid: { horizontalAlignment: 'center' },
                    letterSpacing
                });
                const stickerIcon = await components_9.Icon.create({
                    fill: '#fff',
                    width: 14,
                    height: 14,
                    display: 'block',
                    margin: { left: 'auto', right: 'auto' }
                });
                stickerSection.classList.add('sticker');
                stickerSection.appendChild(this.$render("i-vstack", { position: 'absolute', top: '0.75rem', right: '-1.6rem', width: 50, lineHeight: '1rem' },
                    stickerIcon,
                    stickerLabel));
                const setAvailableQty = async () => {
                    if (!this.state.isRpcWalletConnected() || !this.manageStake)
                        return;
                    const o = opt;
                    const _totalLocked = await (0, index_14.getStakingTotalLocked)(rpcWallet, o.address);
                    totalLocked[o.address] = _totalLocked;
                    const optionQty = new eth_wallet_7.BigNumber(o.maxTotalLock).minus(_totalLocked).shiftedBy(defaultDecimalsOffset);
                    if (o.mode === 'Stake') {
                        const btnStake = this.manageStake.btnStake;
                        const isStaking = this.state.getStakingStatus(index_12.CurrentMode.STAKE);
                        if (btnStake) {
                            let isValidInput = false;
                            const inputElm = this.manageStake.inputAmount;
                            if (inputElm) {
                                const inputVal = new eth_wallet_7.BigNumber(inputElm.value || 0);
                                isValidInput = inputVal.gt(0) && inputVal.lte(this.manageStake.getBalance()) && !this.manageStake.needToBeApproval();
                            }
                            btnStake.enabled = !isStaking && isValidInput && (isStarted && !(optionQty.lte(0) || isClosed));
                        }
                    }
                    else {
                        const btnUnstake = this.manageStake.btnUnstake;
                        const isUnstaking = this.state.getStakingStatus(index_12.CurrentMode.UNLOCK);
                        if (btnUnstake) {
                            btnUnstake.enabled = !isUnstaking && o.mode !== 'Stake' && Number(o.stakeQty) != 0 && !this.manageStake.needToBeApproval();
                        }
                    }
                    if (isClosed) {
                        if (stickerLabel.caption !== this.i18n.get('$close')) {
                            stickerSection.border.bottom = { width: '50px', style: 'solid', color: '#0c1234' };
                            stickerIcon.fill = '#f7d064';
                            stickerLabel.font = { size: '0.75rem', color: '#f7d064' };
                            stickerLabel.caption = this.i18n.get('$close');
                            stickerIcon.name = 'check-square';
                        }
                    }
                    else if (optionQty.lte(0)) {
                        if (stickerLabel.caption !== this.i18n.get('$sold_out')) {
                            stickerLabel.caption = this.i18n.get('$sold_out');
                            stickerIcon.name = 'star';
                            stickerSection.border.bottom = { width: '50px', style: 'solid', color: '#ccc' };
                            stickerIcon.fill = '#fff';
                            stickerLabel.font = { size: '0.75rem', color: '#3f3f42' };
                        }
                    }
                    else {
                        if (stickerLabel.caption !== this.i18n.get('$active')) {
                            stickerLabel.caption = this.i18n.get('$active');
                            stickerIcon.name = 'star';
                        }
                    }
                    if (!stickerSection.visible) {
                        stickerSection.visible = true;
                    }
                };
                const setEndRemainingTime = () => {
                    isStarted = (0, components_9.moment)(activeStartTime).diff((0, components_9.moment)()) <= 0;
                    isClosed = (0, components_9.moment)(activeEndTime).diff((0, components_9.moment)()) <= 0;
                    activeTimerRow.visible = !this.hideDate && isStarted && !isClosed;
                    if (activeEndTime == 0) {
                        endDay.caption = endHour.caption = endMin.caption = '0';
                        if (this.activeTimer) {
                            clearInterval(this.activeTimer);
                        }
                    }
                    else {
                        const days = (0, components_9.moment)(activeEndTime).diff((0, components_9.moment)(), 'days');
                        const hours = (0, components_9.moment)(activeEndTime).diff((0, components_9.moment)(), 'hours') - days * 24;
                        const mins = (0, components_9.moment)(activeEndTime).diff((0, components_9.moment)(), 'minutes') - days * 24 * 60 - hours * 60;
                        endDay.caption = `${days}`;
                        endHour.caption = `${hours}`;
                        endMin.caption = `${mins}`;
                    }
                };
                const setTimer = () => {
                    setEndRemainingTime();
                    setAvailableQty();
                };
                setTimer();
                const option = { ...opt };
                this.manageStake = new index_15.default(undefined, {
                    width: '100%',
                });
                this.manageStake.state = this.state;
                this.manageStake.onRefresh = () => this.initializeWidgetConfig(true);
                const isClaim = option.mode === 'Claim';
                const isStake = option.mode === 'Stake';
                const rewardsData = option.rewardsData && option.rewardsData[0] ? [option.rewardsData[0]] : [];
                const rewardOptions = !isClaim ? rewardsData : [];
                let aprInfo = {};
                const claimStakedRow = await components_9.HStack.create({ verticalAlignment: 'center', horizontalAlignment: 'space-between' });
                claimStakedRow.appendChild(this.$render("i-label", { caption: "$you_staked", font: { size: '1rem' }, letterSpacing: letterSpacing }));
                claimStakedRow.appendChild(this.$render("i-label", { caption: `${(0, index_12.formatNumber)(new eth_wallet_7.BigNumber(option.stakeQty).shiftedBy(defaultDecimalsOffset))} ${lockedTokenSymbol}`, font: { size: '1rem' }, letterSpacing: letterSpacing }));
                const rowRewards = !isStake || this.showRewardsInStakeMode ? await components_9.VStack.create({ gap: 8, verticalAlignment: 'center' }) : [];
                if (!isStake || this.showRewardsInStakeMode) {
                    for (let idx = 0; idx < rewardsData.length; idx++) {
                        const reward = rewardsData[idx];
                        const rewardToken = this.getRewardToken(reward.rewardTokenAddress);
                        const rewardTokenDecimals = rewardToken.decimals || 18;
                        let decimalsOffset = 18 - rewardTokenDecimals;
                        let rewardLockedDecimalsOffset = decimalsOffset;
                        if (rewardTokenDecimals !== 18 && lockedTokenDecimals !== 18) {
                            rewardLockedDecimalsOffset = decimalsOffset * 2;
                        }
                        else if (lockedTokenDecimals !== 18 && rewardTokenDecimals === 18) {
                            rewardLockedDecimalsOffset = rewardTokenDecimals - lockedTokenDecimals;
                            decimalsOffset = 18 - lockedTokenDecimals;
                        }
                        const rewardSymbol = rewardToken.symbol || '';
                        rowRewards.appendChild(this.$render("i-hstack", { horizontalAlignment: "space-between" },
                            this.$render("i-label", { caption: this.i18n.get('$token_locked', { token: rewardSymbol }), font: { size: '1rem', color: Theme.text.primary }, letterSpacing: letterSpacing }),
                            this.$render("i-label", { caption: `${(0, index_12.formatNumber)(new eth_wallet_7.BigNumber(reward.vestedReward || 0).shiftedBy(rewardLockedDecimalsOffset))} ${rewardSymbol}`, font: { size: '1rem' }, letterSpacing: letterSpacing })));
                        // rowRewards.appendChild(
                        // 	<i-hstack horizontalAlignment="space-between">
                        // 		<i-label caption={this.i18n.get('$token_vesting_start', {token: rewardSymbol})} font={{ size: '16px', color: colorText }} />
                        // 		<i-label caption={reward.vestingStart ? reward.vestingStart.format('YYYY-MM-DD HH:mm:ss') : 'TBC'} font={{ size: '16px', color: colorText }} />
                        // 	</i-hstack>
                        // );
                        // rowRewards.appendChild(
                        // 	<i-hstack horizontalAlignment="space-between">
                        // 		<i-label caption={this.i18n.get('$token_vesting_end', {token: rewardSymbol})} font={{ size: '16px', color: colorText }} />
                        // 		<i-label caption={reward.vestingEnd ? reward.vestingEnd.format('YYYY-MM-DD HH:mm:ss') : 'TBC'} font={{ size: '16px', color: colorText }} />
                        // 	</i-hstack>
                        // );
                        const passClaimStartTime = !(reward.claimStartTime && (0, components_9.moment)().diff(components_9.moment.unix(reward.claimStartTime)) < 0);
                        let rewardClaimable = `0 ${rewardSymbol}`;
                        if (passClaimStartTime && isClaim) {
                            rewardClaimable = `${(0, index_12.formatNumber)(new eth_wallet_7.BigNumber(reward.claimable).shiftedBy(decimalsOffset))} ${rewardSymbol}`;
                        }
                        let startClaimingText = '';
                        if (!(!reward.claimStartTime || passClaimStartTime) && isClaim) {
                            const claimStart = components_9.moment.unix(reward.claimStartTime).format('YYYY-MM-DD HH:mm:ss');
                            startClaimingText = this.i18n.get('$claim_token_after_start', { token: rewardSymbol, start: claimStart });
                        }
                        rowRewards.appendChild(this.$render("i-hstack", { horizontalAlignment: "space-between" },
                            this.$render("i-label", { caption: this.i18n.get('$token_claimable', { token: rewardSymbol }), font: { size: '1rem' }, letterSpacing: letterSpacing }),
                            this.$render("i-label", { caption: rewardClaimable, font: { size: '1rem' } }),
                            startClaimingText ? this.$render("i-label", { caption: startClaimingText, font: { size: '1rem' }, letterSpacing: letterSpacing }) : []));
                        const btnClaim = await components_9.Button.create({
                            rightIcon: {
                                spin: true,
                                fill: '#fff',
                                visible: false,
                                margin: { left: '0.25rem', right: '0.25rem' },
                                width: 16, height: 16
                            },
                            caption: rpcWalletConnected ? this.i18n.get('$claim_token', { token: rewardSymbol }) : this.i18n.get('$switch_network'),
                            font: { size: '1rem', bold: true },
                            enabled: !rpcWalletConnected || (rpcWalletConnected && !(!passClaimStartTime || new eth_wallet_7.BigNumber(reward.claimable).isZero()) && isClaim),
                            margin: { left: 'auto', right: 'auto', bottom: 10 },
                            padding: { top: '0.625rem', bottom: '0.625rem' },
                            border: { radius: 12 },
                            maxWidth: '100%',
                            width: 370,
                            height: 'auto'
                        });
                        btnClaim.classList.add('btn-os');
                        btnClaim.onClick = () => rpcWalletConnected ? this.onClaim(btnClaim, { reward, rewardSymbol }) : this.connectWallet();
                        rowRewards.appendChild(btnClaim);
                    }
                    ;
                }
                const getAprValue = (rewardOption) => {
                    if (rewardOption && aprInfo && aprInfo[rewardOption.rewardTokenAddress]) {
                        const apr = new eth_wallet_7.BigNumber(aprInfo[rewardOption.rewardTokenAddress]).times(100).toFormat(2, eth_wallet_7.BigNumber.ROUND_DOWN);
                        return `${apr}%`;
                    }
                    return '';
                };
                const durationDays = option.minLockTime / (60 * 60 * 24);
                const _lockedTokenObject = (0, index_13.getLockedTokenObject)(option, option.tokenInfo, this.tokenMap);
                const _lockedTokenIconPaths = (0, index_13.getLockedTokenIconPaths)(option, _lockedTokenObject, chainId, this.tokenMap);
                const pathsLength = _lockedTokenIconPaths.length;
                const rewardToken = rewardsData?.length ? this.getRewardToken(rewardsData[0].rewardTokenAddress) : null;
                const pnlContractProps = this.hideDate ? {
                    direction: 'horizontal',
                    width: '100%',
                    justifyContent: 'end',
                    gap: '1rem'
                } : {
                    direction: 'vertical',
                    width: '25%',
                    justifyContent: 'center',
                    alignItems: 'end',
                    gap: 4
                };
                stakingElm.appendChild(this.$render("i-vstack", { gap: 15, width: "100%", maxWidth: index_13.maxWidth, height: "100%", padding: { top: 10, bottom: 10, left: 20, right: 20 }, position: "relative" },
                    stickerSection,
                    this.$render("i-hstack", { gap: 10, width: "100%", verticalAlignment: "center" },
                        this.$render("i-hstack", { gap: 10, width: "50%" },
                            this.$render("i-hstack", { width: pathsLength === 1 ? 63.5 : 80, position: "relative", verticalAlignment: "center" },
                                this.$render("i-image", { width: 60, height: 60, url: scom_token_list_5.assets.tokenPath(rewardToken, chainId), fallbackUrl: index_13.fallBackUrl }),
                                _lockedTokenIconPaths.map((v, idxImg) => {
                                    return this.$render("i-image", { position: "absolute", width: 28, height: 28, bottom: 0, left: (idxImg * 20) + 35, url: scom_token_list_5.assets.fullPath(v), fallbackUrl: index_13.fallBackUrl });
                                })),
                            this.$render("i-vstack", { gap: 2, overflow: { x: 'hidden' }, verticalAlignment: "center" },
                                this.$render("i-label", { visible: !!campaign.name, caption: campaign.name, font: { size: '1.25rem', color: Theme.text.secondary, bold: true }, textOverflow: "ellipsis", letterSpacing: letterSpacing, class: "text-overflow" }),
                                this.$render("i-label", { visible: !!campaign.desc, caption: campaign.desc, font: { size: '1rem' }, opacity: 0.5, textOverflow: "ellipsis", letterSpacing: letterSpacing, class: "text-overflow" }))),
                        await Promise.all(rewardOptions.map(async (rewardOption, idx) => {
                            const lbApr = await components_9.Label.create({ font: { size: '2rem', color: Theme.text.secondary }, letterSpacing });
                            const lbRate = await components_9.Label.create({ font: { size: '1rem' }, opacity: 0.5, letterSpacing });
                            lbApr.classList.add('text-overflow');
                            const rewardToken = this.getRewardToken(rewardOption.rewardTokenAddress);
                            const rewardTokenDecimals = rewardToken.decimals || 18;
                            const decimalsOffset = 18 - rewardTokenDecimals;
                            const lockTokenType = option.lockTokenType;
                            // const rateDesc = `1 ${lockTokenType === LockTokenType.LP_Token ? 'LP' : tokenSymbol(option.lockTokenAddress)} : ${new BigNumber(rewardOption.multiplier).shiftedBy(decimalsOffset).toFixed()} ${tokenSymbol(rewardOption.rewardTokenAddress)}`;
                            const rateDesc = `1 ${lockTokenType === index_12.LockTokenType.LP_Token ? 'LP' : (0, index_13.tokenSymbol)(this.chainId, option.lockTokenAddress)} : ${rewardOption.multiplier} ${(0, index_13.tokenSymbol)(this.chainId, rewardOption.rewardTokenAddress)}`;
                            const updateApr = async () => {
                                if (lockTokenType === index_12.LockTokenType.ERC20_Token) {
                                    const apr = await (0, index_14.getERC20RewardCurrentAPR)(rpcWallet, rewardOption, lockedTokenObject, durationDays);
                                    if (!isNaN(parseFloat(apr))) {
                                        aprInfo[rewardOption.rewardTokenAddress] = apr;
                                    }
                                }
                                else if (lockTokenType === index_12.LockTokenType.LP_Token) {
                                    if (rewardOption.referencePair) {
                                        aprInfo[rewardOption.rewardTokenAddress] = await (0, index_14.getLPRewardCurrentAPR)(rpcWallet, rewardOption, option.tokenInfo?.lpToken?.object, durationDays);
                                    }
                                }
                                else {
                                    aprInfo[rewardOption.rewardTokenAddress] = await (0, index_14.getVaultRewardCurrentAPR)(rpcWallet, rewardOption, option.tokenInfo?.vaultToken?.object, durationDays);
                                }
                                const aprValue = getAprValue(rewardOption);
                                lbApr.caption = `APR ${aprValue}`;
                                lbRate.caption = rateDesc;
                            };
                            updateApr();
                            this.listAprTimer.push(setInterval(updateApr, 10000));
                            const aprValue = getAprValue(rewardOption);
                            lbApr.caption = `APR ${aprValue}`;
                            lbRate.caption = rateDesc;
                            return this.$render("i-vstack", { verticalAlignment: "center", visible: !!aprValue },
                                lbApr,
                                lbRate);
                        }))),
                    this.$render("i-hstack", { width: "100%", verticalAlignment: "center" },
                        this.$render("i-vstack", { gap: 2, width: "25%", verticalAlignment: "center", visible: !this.hideDate },
                            this.$render("i-label", { caption: "$start_date", font: { size: '0.875rem' }, opacity: 0.5, letterSpacing: letterSpacing }),
                            this.$render("i-label", { caption: (0, index_12.formatDate)(option.startOfEntryPeriod, 'DD MMM, YYYY'), font: { size: '1rem' }, letterSpacing: letterSpacing })),
                        activeTimerRow,
                        this.$render("i-vstack", { gap: 2, width: "25%", verticalAlignment: "center", visible: !this.hideDate },
                            this.$render("i-label", { caption: "$stake_duration", font: { size: '0.875rem' }, opacity: 0.5, letterSpacing: letterSpacing }),
                            this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                                this.$render("i-button", { height: "auto", caption: durationDays < 1 ? this.i18n.get('$less_than_one_day') : this.i18n.get('$duration_days', { duration: durationDays.toString() }), font: { size: '12px', color: Theme.colors.secondary.contrastText, weight: 700 }, background: { color: `${Theme.colors.secondary.main} !important` }, border: { radius: 12, width: 1, style: 'solid', color: 'transparent' }, padding: { top: 2.5, bottom: 2.5, left: 8, right: 8 }, cursor: "default", class: "btn-os cursor-default" }))),
                        this.$render("i-stack", { margin: { left: 'auto' }, ...pnlContractProps },
                            this.$render("i-hstack", { gap: 4, class: "pointer", width: "fit-content", verticalAlignment: "center", onClick: () => this.getLPToken(campaign, lockedTokenSymbol, chainId), visible: this.showSwapTokenLink },
                                this.$render("i-icon", { name: "external-link-alt", width: 12, height: 12, fill: Theme.text.primary }),
                                this.$render("i-label", { caption: this.i18n.get('$get_token', { token: lockedTokenSymbol }), font: { size: '0.85rem' }, letterSpacing: letterSpacing }),
                                lockedTokenIconPaths.map((v) => {
                                    return this.$render("i-image", { display: "flex", width: 15, height: 15, url: scom_token_list_5.assets.fullPath(v), fallbackUrl: index_13.fallBackUrl });
                                })),
                            campaign.showContractLink ?
                                this.$render("i-hstack", { gap: 4, class: "pointer", width: "fit-content", verticalAlignment: "center", onClick: () => (0, index_13.viewOnExplorerByAddress)(chainId, option.address) },
                                    this.$render("i-icon", { name: "external-link-alt", width: 12, height: 12, fill: Theme.text.primary, class: "inline-block" }),
                                    this.$render("i-label", { caption: "$view_contract", font: { size: '0.85rem' }, letterSpacing: letterSpacing })) : [])),
                    this.$render("i-vstack", { gap: 8 },
                        claimStakedRow,
                        this.$render("i-vstack", { verticalAlignment: "center", horizontalAlignment: "center" }, this.manageStake),
                        rowRewards)));
                await this.manageStake.setData({
                    ...campaign,
                    ...option
                });
                if (this._data.stakeInputValue) {
                    this.manageStake.setInputValue(this._data.stakeInputValue);
                }
                const border = this.widgetType === scom_dapp_container_1.WidgetType.Standalone ? { width: 1, style: 'solid', color: '#7979794a' } : undefined;
                containerSection.appendChild(this.$render("i-hstack", { background: { color: Theme.background.main }, width: "100%", height: index_13.maxHeight, border: border }, stakingElm));
                this.stakingElm.clearInnerHTML();
                this.stakingElm.append(this.noCampaignSection, containerSection);
            };
            this.state = new index_13.State(data_json_1.default);
        }
        removeRpcWalletEvents() {
            const rpcWallet = this.rpcWallet;
            for (let event of this.rpcWalletEvents) {
                rpcWallet.unregisterWalletEvent(event);
            }
            this.rpcWalletEvents = [];
        }
        onHide() {
            this.dappContainer.onHide();
            this.removeRpcWalletEvents();
        }
        async init() {
            this.i18n.init({ ...(0, index_16.mergeI18nData)([index_16.commonJson, index_16.mainJson]) });
            await super.init();
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            const widgetType = this.getAttribute('widgetType', true);
            if (widgetType)
                this.widgetType = widgetType;
            const hideDate = this.getAttribute('hideDate', true);
            if (hideDate != null)
                this.hideDate = hideDate;
            if (!lazyLoad) {
                const data = this.getAttribute('data', true);
                if (data) {
                    await this.setData(data);
                }
                else {
                    this.renderEmpty();
                }
            }
            this.executeReadyCallback();
        }
        render() {
            return (this.$render("i-scom-dapp-container", { id: "dappContainer", class: index_css_2.stakingDappContainer },
                this.$render("i-panel", { class: index_css_2.stakingComponent, minHeight: 200 },
                    this.$render("i-panel", { id: "stakingLayout", width: index_13.maxWidth, height: index_13.maxHeight, maxWidth: "100%", margin: { left: 'auto', right: 'auto' }, overflow: 'hidden' },
                        this.$render("i-vstack", { id: "loadingElm", background: { color: Theme.background.main }, class: "i-loading-overlay" },
                            this.$render("i-vstack", { class: "i-loading-spinner", horizontalAlignment: "center", verticalAlignment: "center" },
                                this.$render("i-icon", { class: "i-loading-spinner_icon", image: { url: assets_2.default.fullPath('img/loading.svg'), width: 36, height: 36 } }),
                                this.$render("i-label", { caption: "Loading...", font: { color: '#FD4A4C', size: '1.5em' }, letterSpacing: letterSpacing, class: "i-loading-spinner_text" }))),
                        this.$render("i-panel", { id: "stakingElm", background: { color: Theme.background.main }, width: "100%", height: "100%", maxWidth: index_13.maxWidth, maxHeight: index_13.maxHeight, class: "wrapper" })),
                    this.$render("i-scom-wallet-modal", { id: "mdWallet", wallets: [] }),
                    this.$render("i-scom-tx-status-modal", { id: "txStatusModal" }))));
        }
        async handleFlowStage(target, stage, options) {
            let widget;
            if (stage === 'initialSetup') {
                widget = new initialSetup_1.default();
                target.appendChild(widget);
                await widget.ready();
                widget.state = this.state;
                await widget.handleFlowStage(target, stage, options);
            }
            else {
                widget = this;
                if (!options.isWidgetConnected) {
                    target.appendChild(widget);
                    await this.ready();
                }
                let properties = options.properties;
                let tag = options.tag;
                this.state.handleNextFlowStep = options.onNextStep;
                this.state.handleAddTransactions = options.onAddTransactions;
                this.state.handleJumpToStep = options.onJumpToStep;
                this.state.handleUpdateStepStatus = options.onUpdateStepStatus;
                await this.setData(properties);
                if (tag) {
                    await this.setTag(tag);
                }
            }
            return {
                widget: widget
            };
        }
    };
    ScomStaking = ScomStaking_1 = __decorate([
        components_9.customModule,
        (0, components_9.customElements)('i-scom-staking')
    ], ScomStaking);
    exports.default = ScomStaking;
});
