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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
        setFlowInvokerId(id) {
            this.flowInvokerId = id;
        }
        initRpcWallet(chainId) {
            var _a, _b, _c;
            if (this.rpcWalletId) {
                return this.rpcWalletId;
            }
            const clientWallet = eth_wallet_3.Wallet.getClientInstance();
            const networkList = Object.values(((_a = components_3.application.store) === null || _a === void 0 ? void 0 : _a.networkMap) || []);
            const instanceId = clientWallet.initRpcWallet({
                networks: networkList,
                defaultChainId: chainId,
                infuraId: (_b = components_3.application.store) === null || _b === void 0 ? void 0 : _b.infuraId,
                multicalls: (_c = components_3.application.store) === null || _c === void 0 ? void 0 : _c.multicalls
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
                this.networkMap[network.chainId] = Object.assign(Object.assign({}, networkInfo), network);
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
            return wallet === null || wallet === void 0 ? void 0 : wallet.isConnected;
        }
        getChainId() {
            const rpcWallet = this.getRpcWallet();
            return rpcWallet === null || rpcWallet === void 0 ? void 0 : rpcWallet.chainId;
        }
        async setApprovalModelAction(options) {
            const approvalOptions = Object.assign(Object.assign({}, options), { spenderAddress: '' });
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
        var _a;
        if (info && tokenObject) {
            if (!tokenMap) {
                tokenMap = scom_token_list_1.tokenStore.getTokenMapByChainId(chainId);
            }
            if (info.lockTokenType == index_3.LockTokenType.ERC20_Token) {
                return [scom_token_list_1.assets.getTokenIconPath(tokenObject, chainId)];
            }
            if (info.lockTokenType == index_3.LockTokenType.LP_Token) {
                const nativeToken = (_a = scom_token_list_1.DefaultTokens[chainId]) === null || _a === void 0 ? void 0 : _a.find((token) => token.isNative);
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
            // let minimumLockTime = await timeIsMoney.minimumLockTime();
            // let maximumTotalLock = await timeIsMoney.maximumTotalLock();
            // let totalLockedWei = await timeIsMoney.totalLocked();
            // let totalCreditWei = await timeIsMoney.getCredit(currentAddress);
            // let lockAmountWei = await timeIsMoney.lockAmount(currentAddress);
            // let withdrawn = await timeIsMoney.withdrawn(currentAddress);
            const minimumLockTimeFuncCallData = wallet.encodeFunctionCall(timeIsMoney, 'minimumLockTime', []);
            const maximumTotalLockFuncCallData = wallet.encodeFunctionCall(timeIsMoney, 'maximumTotalLock', []);
            const totalLockedFuncCallData = wallet.encodeFunctionCall(timeIsMoney, 'totalLocked', []);
            const totalCreditFuncCallData = wallet.encodeFunctionCall(timeIsMoney, 'getCredit', [currentAddress]);
            const lockAmountFuncCallData = wallet.encodeFunctionCall(timeIsMoney, 'lockAmount', [currentAddress]);
            const withdrawnFuncCallData = wallet.encodeFunctionCall(timeIsMoney, 'withdrawn', [currentAddress]);
            const tokenFuncCallData = wallet.encodeFunctionCall(timeIsMoney, 'token', []);
            const endOfEntryPeriodFuncCallData = wallet.encodeFunctionCall(timeIsMoney, 'endOfEntryPeriod', []);
            const perAddressCapFuncCallData = wallet.encodeFunctionCall(timeIsMoney, 'perAddressCap', []);
            const funcCallDataArr = [
                minimumLockTimeFuncCallData,
                maximumTotalLockFuncCallData,
                totalLockedFuncCallData,
                totalCreditFuncCallData,
                lockAmountFuncCallData,
                withdrawnFuncCallData,
                tokenFuncCallData,
                endOfEntryPeriodFuncCallData,
                perAddressCapFuncCallData
            ];
            const result = await wallet.multiCall(funcCallDataArr.map((callData) => {
                return {
                    to: stakingAddress,
                    data: callData
                };
            }));
            const multiCallResults = result.results;
            const minimumLockTime = new eth_wallet_4.BigNumber(wallet.decodeAbiEncodedParameters(timeIsMoney, 'minimumLockTime', multiCallResults[0])[0]);
            const maximumTotalLock = new eth_wallet_4.BigNumber(wallet.decodeAbiEncodedParameters(timeIsMoney, 'maximumTotalLock', multiCallResults[1])[0]);
            const totalLockedWei = new eth_wallet_4.BigNumber(wallet.decodeAbiEncodedParameters(timeIsMoney, 'totalLocked', multiCallResults[2])[0]);
            const totalCreditWei = new eth_wallet_4.BigNumber(wallet.decodeAbiEncodedParameters(timeIsMoney, 'getCredit', multiCallResults[3])[0]);
            const lockAmountWei = new eth_wallet_4.BigNumber(wallet.decodeAbiEncodedParameters(timeIsMoney, 'lockAmount', multiCallResults[4])[0]);
            const withdrawn = wallet.decodeAbiEncodedParameters(timeIsMoney, 'withdrawn', multiCallResults[5])[0];
            const tokenAddress = wallet.decodeAbiEncodedParameters(timeIsMoney, 'token', multiCallResults[6])[0];
            const endOfEntryPeriod = new eth_wallet_4.BigNumber(wallet.decodeAbiEncodedParameters(timeIsMoney, 'endOfEntryPeriod', multiCallResults[7])[0]).toFixed();
            const perAddressCapWei = new eth_wallet_4.BigNumber(wallet.decodeAbiEncodedParameters(timeIsMoney, 'perAddressCap', multiCallResults[8])[0]);
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
            let startOfEntryPeriod = '0';
            try {
                startOfEntryPeriod = (await timeIsMoney.startOfEntryPeriod()).toFixed();
            }
            catch (err) { }
            // let tokenAddress = await timeIsMoney.token();
            // let endOfEntryPeriod = (await timeIsMoney.endOfEntryPeriod()).toFixed();
            // let perAddressCapWei = await timeIsMoney.perAddressCap();
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
                let promises = rewards.map(async (reward, index) => {
                    return new Promise(async (resolve, reject) => {
                        let rewardsContract, admin, multiplier, initialReward, rewardTokenAddress, vestingPeriod, vestingStartDate, claimDeadline;
                        try {
                            let claimable = '0';
                            if (reward.isCommonStartDate) {
                                rewardsContract = new oswap_time_is_money_contract_1.Contracts.RewardsCommonStartDate(wallet, reward.address);
                            }
                            else {
                                rewardsContract = new oswap_time_is_money_contract_1.Contracts.Rewards(wallet, reward.address);
                            }
                            if (mode === 'Claim') {
                                let unclaimedWei = await rewardsContract.unclaimed();
                                claimable = eth_wallet_4.Utils.fromDecimals(unclaimedWei).toFixed();
                            }
                            const adminFuncCallData = wallet.encodeFunctionCall(rewardsContract, 'admin', []);
                            const tokenFuncCallData = wallet.encodeFunctionCall(rewardsContract, 'token', []);
                            const multiplierFuncCallData = wallet.encodeFunctionCall(rewardsContract, 'multiplier', []);
                            const initialRewardFuncCallData = wallet.encodeFunctionCall(rewardsContract, 'initialReward', []);
                            const vestingPeriodFuncCallData = wallet.encodeFunctionCall(rewardsContract, 'vestingPeriod', []);
                            const claimDeadlineFuncCallData = wallet.encodeFunctionCall(rewardsContract, 'claimDeadline', []);
                            let callDataArr = [
                                adminFuncCallData,
                                tokenFuncCallData,
                                multiplierFuncCallData,
                                initialRewardFuncCallData,
                                vestingPeriodFuncCallData,
                                claimDeadlineFuncCallData
                            ];
                            if (reward.isCommonStartDate) {
                                const vestingStartDateFuncCallData = wallet.encodeFunctionCall(rewardsContract, 'vestingStartDate', []);
                                callDataArr.push(vestingStartDateFuncCallData);
                            }
                            const result = await wallet.multiCall(callDataArr.map((callData) => {
                                return {
                                    to: reward.address,
                                    data: callData
                                };
                            }));
                            const multiCallResults = result.results;
                            admin = wallet.decodeAbiEncodedParameters(rewardsContract, 'admin', multiCallResults[0])[0];
                            rewardTokenAddress = wallet.decodeAbiEncodedParameters(rewardsContract, 'token', multiCallResults[1])[0];
                            let multiplierWei = new eth_wallet_4.BigNumber(wallet.decodeAbiEncodedParameters(rewardsContract, 'multiplier', multiCallResults[2])[0]);
                            initialReward = new eth_wallet_4.BigNumber(wallet.decodeAbiEncodedParameters(rewardsContract, 'initialReward', multiCallResults[3])[0]).toFixed();
                            vestingPeriod = new eth_wallet_4.BigNumber(wallet.decodeAbiEncodedParameters(rewardsContract, 'vestingPeriod', multiCallResults[4])[0]).toNumber();
                            claimDeadline = new eth_wallet_4.BigNumber(wallet.decodeAbiEncodedParameters(rewardsContract, 'claimDeadline', multiCallResults[5])[0]).toNumber();
                            if (reward.isCommonStartDate) {
                                vestingStartDate = new eth_wallet_4.BigNumber(wallet.decodeAbiEncodedParameters(rewardsContract, 'vestingStartDate', multiCallResults[6])[0]).toNumber();
                            }
                            // admin = await rewardsContract.admin();
                            // rewardTokenAddress = await rewardsContract.token();
                            // let multiplierWei = await rewardsContract.multiplier();
                            // initialReward = Utils.fromDecimals(await rewardsContract.initialReward(), rewardTokenDecimals).toFixed();
                            // vestingPeriod = (await rewardsContract.vestingPeriod()).toNumber();
                            // claimDeadline = (await rewardsContract.claimDeadline()).toNumber();
                            // if (reward.isCommonStartDate) {
                            //   vestingStartDate = (await rewardsContract.vestingStartDate()).toNumber();
                            // }
                            let rewardToken = new eth_wallet_4.Erc20(wallet, rewardTokenAddress);
                            let rewardTokenDecimals = await rewardToken.decimals;
                            multiplier = eth_wallet_4.Utils.fromDecimals(multiplierWei, rewardTokenDecimals).toFixed();
                            let rewardAmount = new eth_wallet_4.BigNumber(multiplier).multipliedBy(maxTotalLock).toFixed();
                            rewardsData.push(Object.assign(Object.assign({}, reward), { claimable,
                                rewardTokenAddress,
                                multiplier,
                                initialReward,
                                vestingPeriod,
                                admin,
                                vestingStartDate,
                                rewardAmount,
                                index }));
                        }
                        catch (_a) { }
                        resolve();
                    });
                });
                await Promise.all(promises);
                return Object.assign(Object.assign(Object.assign({}, option), obj), { rewardsData: rewardsData, rewards: rewardsData.sort((a, b) => a.index - b.index) });
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
        var _a;
        let chainId = wallet.chainId;
        let stakingCampaignInfo = stakingInfo[chainId];
        if (!stakingCampaignInfo)
            return null;
        let staking = Object.assign({}, stakingCampaignInfo.staking);
        let optionExtendedInfo;
        try {
            optionExtendedInfo = await getDefaultStakingByAddress(wallet, staking);
        }
        catch (error) { }
        let stakingExtendInfo = Object.assign(Object.assign({}, staking), optionExtendedInfo);
        // const admin = stakingExtendInfo.rewards && stakingExtendInfo.rewards[0] ? stakingExtendInfo.rewards[0].admin : '';
        return Object.assign(Object.assign({}, stakingCampaignInfo), { campaignStart: stakingExtendInfo.startOfEntryPeriod / 1000, campaignEnd: stakingExtendInfo.endOfEntryPeriod / 1000, tokenAddress: (_a = stakingExtendInfo.tokenAddress) === null || _a === void 0 ? void 0 : _a.toLowerCase(), option: stakingExtendInfo });
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
        catch (_a) {
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
        catch (_a) { }
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
            },
            '.staking-token-input > input': {
                border: 'none',
                width: '100% !important',
                height: '100% !important',
                backgroundColor: 'transparent',
                color: Theme.input.fontColor,
                fontSize: '1rem',
                textAlign: 'left',
                paddingInline: 8,
            },
        }
    });
});
define("@scom/scom-staking/manage-stake/index.tsx", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-staking/global/index.ts", "@scom/scom-staking/store/index.ts", "@scom/scom-token-list", "@scom/scom-staking/staking-utils/index.ts", "@scom/scom-staking/manage-stake/index.css.ts"], function (require, exports, components_6, eth_wallet_5, index_5, index_6, scom_token_list_3, index_7, index_css_1) {
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
                this.txStatusModal.message = Object.assign({}, params);
                this.txStatusModal.showModal();
            };
            this.onApproveToken = async () => {
                this.showMessage('warning', `Approve ${this.tokenSymbol}`);
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
                var _a;
                if (this.inputAmount.enabled === false)
                    return;
                this.currentMode = index_5.CurrentMode.STAKE;
                (0, index_5.limitInputNumber)(this.inputAmount, ((_a = this.lockedTokenObject) === null || _a === void 0 ? void 0 : _a.decimals) || 18);
                if (this.state.isRpcWalletConnected())
                    this.approvalModelAction.checkAllowance(this.lockedTokenObject, this.inputAmount.value);
            };
            this.setMaxBalance = () => {
                var _a;
                this.currentMode = index_5.CurrentMode.STAKE;
                this.inputAmount.value = eth_wallet_5.BigNumber.min(this.availableQty, this.balance, this.perAddressCap).toFixed();
                (0, index_5.limitInputNumber)(this.inputAmount, ((_a = this.lockedTokenObject) === null || _a === void 0 ? void 0 : _a.decimals) || 18);
                if (this.state.isRpcWalletConnected())
                    this.approvalModelAction.checkAllowance(this.lockedTokenObject, this.inputAmount.value);
            };
            this.renderStakingInfo = async (info) => {
                var _a;
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
                const defaultDecimalsOffset = 18 - (((_a = this.lockedTokenObject) === null || _a === void 0 ? void 0 : _a.decimals) || 18);
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
                var _a, _b;
                if (((_a = this.stakingInfo) === null || _a === void 0 ? void 0 : _a.mode) !== 'Stake')
                    return;
                const totalLocked = await (0, index_7.getStakingTotalLocked)(this.state.getRpcWallet(), this.address);
                const activeStartTime = this.stakingInfo.startOfEntryPeriod;
                const activeEndTime = this.stakingInfo.endOfEntryPeriod;
                const lockedTokenDecimals = ((_b = this.lockedTokenObject) === null || _b === void 0 ? void 0 : _b.decimals) || 18;
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
                    this.showMessage('warning', `${this.currentMode === index_5.CurrentMode.STAKE ? 'Stake' : 'Unlock'} ${this.tokenSymbol}`);
                    if (this.currentMode === index_5.CurrentMode.STAKE) {
                        (0, index_7.lockToken)(this.lockedTokenObject, this.inputAmount.value, this.address, this.callback);
                    }
                    else {
                        (0, index_7.withdrawToken)(this.address, this.callback);
                    }
                },
                onToBeApproved: async (token) => {
                    if (new eth_wallet_5.BigNumber(this.inputAmount.value).lte(eth_wallet_5.BigNumber.min(this.availableQty, this.balance, this.perAddressCap))) {
                        this.btnApprove.caption = `Approve ${token.symbol}`;
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
                    var _a;
                    this.btnApprove.visible = false;
                    const isClosed = (0, components_6.moment)(((_a = this.stakingInfo) === null || _a === void 0 ? void 0 : _a.endOfEntryPeriod) || 0).diff((0, components_6.moment)()) <= 0;
                    if (this.currentMode === index_5.CurrentMode.STAKE) {
                        const amount = new eth_wallet_5.BigNumber(this.inputAmount.value);
                        if (amount.gt(this.balance)) {
                            this.btnStake.caption = 'Insufficient Balance';
                            this.btnStake.enabled = false;
                            return;
                        }
                        this.btnStake.caption = 'Stake';
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
                        this.btnApprove.caption = `Approving`;
                        this.btnApprove.enabled = false;
                        this.btnApprove.rightIcon.visible = true;
                        this.btnMax.enabled = false;
                        this.inputAmount.enabled = false;
                    }
                },
                onApproved: async (token) => {
                    const rpcWallet = this.state.getRpcWallet();
                    try {
                        if (rpcWallet.address) {
                            await scom_token_list_3.tokenStore.updateTokenBalances(rpcWallet, [(0, index_6.getChainNativeToken)(this.state.getChainId())]);
                        }
                    }
                    catch (_a) { }
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
                            this.btnStake.caption = 'Staking';
                            this.btnStake.rightIcon.visible = true;
                            this.state.setStakingStatus(this.currentMode, true);
                            this.btnUnstake.enabled = false;
                        }
                        else {
                            this.btnUnstake.caption = 'Unstaking';
                            this.btnUnstake.rightIcon.visible = true;
                            this.state.setStakingStatus(this.currentMode, true);
                            this.btnStake.enabled = false;
                        }
                    }
                },
                onPaid: async (data, receipt) => {
                    if (this.onRefresh) {
                        const rpcWallet = this.state.getRpcWallet();
                        if (rpcWallet.address) {
                            await scom_token_list_3.tokenStore.updateAllTokenBalances(rpcWallet);
                        }
                        await this.onRefresh();
                        this.state.setStakingStatus(this.currentMode, false);
                    }
                    if (this.currentMode === index_5.CurrentMode.STAKE) {
                        this.btnStake.caption = 'Stake';
                        this.btnStake.rightIcon.visible = false;
                        if (this.state.flowInvokerId) {
                            let event = (0, index_7.parseDepositEvent)(this.state, receipt, this.address);
                            const timestamp = await this.state.getRpcWallet().getBlockTimestamp(receipt.blockNumber.toString());
                            const transactionsInfoArr = [
                                {
                                    desc: `Stake ${this.lockedTokenObject.symbol}`,
                                    fromToken: this.lockedTokenObject,
                                    toToken: null,
                                    fromTokenAmount: event.amount.toFixed(),
                                    toTokenAmount: '-',
                                    hash: receipt.transactionHash,
                                    timestamp
                                }
                            ];
                            console.log('transactionsInfoArr', transactionsInfoArr);
                            const eventName = `${this.state.flowInvokerId}:addTransactions`;
                            components_6.application.EventBus.dispatch(eventName, {
                                list: transactionsInfoArr
                            });
                        }
                    }
                    else {
                        this.btnUnstake.caption = 'Unstake';
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
                        this.btnStake.caption = 'Stake';
                        this.btnStake.rightIcon.visible = false;
                    }
                    else {
                        this.btnUnstake.caption = 'Unstake';
                        this.btnUnstake.rightIcon.visible = false;
                    }
                    this.showMessage('error', err);
                    this.state.setStakingStatus(this.currentMode, false);
                }
            });
            this.state.approvalModel.spenderAddress = this.address;
        }
        init() {
            super.init();
        }
        render() {
            return (this.$render("i-panel", { class: index_css_1.stakingManageStakeStyle },
                this.$render("i-hstack", { gap: 10, verticalAlignment: "center", horizontalAlignment: "center" },
                    this.$render("i-hstack", { id: "wrapperInputAmount", gap: 4, width: 280, height: 36, padding: { right: 8 }, background: { color: Theme.input.background }, border: { radius: 8 }, verticalAlignment: "center", horizontalAlignment: "space-between" },
                        this.$render("i-input", { id: "inputAmount", inputType: "number", placeholder: "0.0", class: "staking-token-input", width: "100%", height: "100%", onChanged: () => this.onInputAmount() }),
                        this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                            this.$render("i-button", { id: "btnMax", caption: "Max", enabled: false, 
                                // background={{ color: `${Theme.colors.primary.main} !important` }}
                                // font={{ color: Theme.colors.primary.contrastText }}
                                class: "btn-os", width: 45, minHeight: 25, onClick: () => this.setMaxBalance() }),
                            this.$render("i-label", { id: "lbToken", font: { size: '14px', color: Theme.input.fontColor }, opacity: 0.5 }))),
                    this.$render("i-hstack", { gap: 10, width: "calc(100% - 290px)" },
                        this.$render("i-button", { id: "btnApprove", caption: "Approve", enabled: false, visible: false, width: "100%", minHeight: 36, border: { radius: 12 }, rightIcon: { spin: true, visible: false, fill: '#fff' }, 
                            // rightIcon={{ spin: true, visible: false, fill: Theme.colors.primary.contrastText }}
                            // background={{ color: `${Theme.colors.primary.main} !important` }}
                            // font={{ color: Theme.colors.primary.contrastText }}
                            class: "btn-os", onClick: () => this.onApproveToken() }),
                        this.$render("i-button", { id: "btnStake", caption: "Stake", enabled: false, width: "100%", minHeight: 36, border: { radius: 12 }, rightIcon: { spin: true, visible: false, fill: '#fff' }, 
                            // rightIcon={{ spin: true, visible: false, fill: Theme.colors.primary.contrastText }}
                            // background={{ color: `${Theme.colors.primary.main} !important` }}
                            // font={{ color: Theme.colors.primary.contrastText }}
                            class: "btn-os", onClick: () => this.onStake() }),
                        this.$render("i-button", { id: "btnUnstake", caption: "Unstake", enabled: false, width: "100%", minHeight: 36, border: { radius: 12 }, rightIcon: { spin: true, visible: false, fill: '#fff' }, 
                            // rightIcon={{ spin: true, visible: false, fill: Theme.colors.primary.contrastText }}
                            // background={{ color: `${Theme.colors.primary.main} !important` }}
                            // font={{ color: Theme.colors.primary.contrastText }}
                            class: "btn-os", onClick: () => this.onUnstake() }))),
                this.$render("i-scom-tx-status-modal", { id: "txStatusModal" })));
        }
    };
    ManageStake = __decorate([
        (0, components_6.customElements)('staking-manage-stake')
    ], ManageStake);
    exports.default = ManageStake;
});
define("@scom/scom-staking/index.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-staking/store/index.ts"], function (require, exports, components_7, index_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stakingComponent = exports.stakingDappContainer = void 0;
    const Theme = components_7.Styles.Theme.ThemeVars;
    const colorVar = {
        primaryButton: 'transparent linear-gradient(90deg, #AC1D78 0%, #E04862 100%) 0% 0% no-repeat padding-box',
        primaryGradient: 'linear-gradient(255deg,#f15e61,#b52082)',
        primaryDisabled: 'transparent linear-gradient(270deg,#351f52,#552a42) 0% 0% no-repeat padding-box !important'
    };
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
            'span': {
                letterSpacing: '0.15px',
            },
            '#stakingElm': {
                background: Theme.background.main,
            },
            '.i-loading-overlay': {
                background: Theme.background.main,
            },
            '.btn-os': {
                background: colorVar.primaryButton,
                height: 'auto !important',
                color: '#fff',
                // color: Theme.colors.primary.contrastText,
                transition: 'background .3s ease',
                fontSize: '1rem',
                fontWeight: 'bold',
                $nest: {
                    'i-icon.loading-icon': {
                        marginInline: '0.25rem',
                        width: '16px !important',
                        height: '16px !important',
                    },
                    'svg': {
                        // fill: `${Theme.colors.primary.contrastText} !important`
                        fill: `#fff !important`
                    }
                },
            },
            '.btn-os:not(.disabled):not(.is-spinning):hover, .btn-os:not(.disabled):not(.is-spinning):focus': {
                background: colorVar.primaryGradient,
                backgroundColor: 'transparent',
                boxShadow: 'none',
                opacity: .9
            },
            '.btn-os:not(.disabled):not(.is-spinning):focus': {
                boxShadow: '0 0 0 0.2rem rgb(0 123 255 / 25%)'
            },
            '.btn-os.disabled, .btn-os.is-spinning': {
                background: colorVar.primaryDisabled,
                opacity: 1
            },
            '.hidden': {
                display: 'none !important'
            },
            '.staking-layout': {
                width: '100%',
                marginInline: 'auto',
                overflow: 'hidden',
            },
            '.cursor-default': {
                cursor: 'default',
            },
            '.text-overflow': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            },
            '.wrapper': {
                width: '100%',
                height: '100%',
                maxWidth: index_8.maxWidth,
                maxHeight: index_8.maxHeight,
                $nest: {
                    '.sticker': {
                        position: 'absolute',
                        top: '-8px',
                        right: '-33px',
                        borderInline: '50px solid transparent',
                        borderBottom: '50px solid #20bf55',
                        transform: 'rotate(45deg)',
                        $nest: {
                            '&.sold-out': {
                                borderBottomColor: '#ccc',
                            },
                            '&.closed': {
                                borderBottomColor: '#0c1234',
                                $nest: {
                                    'i-label > *': {
                                        color: '#f7d064 !important',
                                    },
                                    'i-icon': {
                                        fill: '#f7d064'
                                    },
                                    'svg': {
                                        fill: '#f7d064'
                                    }
                                }
                            },
                            '.sticker-text': {
                                position: 'absolute',
                                right: '-1.6rem',
                                top: '0.75rem',
                                width: '50px',
                                lineHeight: '1rem',
                            },
                            'i-label': {
                                display: 'flex',
                                justifyContent: 'center',
                            },
                            'i-label > *': {
                                color: '#3f3f42 !important',
                                fontSize: '0.75rem',
                            },
                            'i-icon': {
                                width: '14px',
                                height: '14px',
                                display: 'block',
                                margin: 'auto',
                            },
                        },
                    },
                    '.custom-timer': {
                        display: 'flex',
                        $nest: {
                            '.timer-value': {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 4,
                                paddingInline: 4,
                                minWidth: 20,
                                height: 20,
                                fontSize: 14
                            },
                            '.timer-unit': {
                                display: 'flex',
                                alignItems: 'center',
                            },
                        },
                    },
                    '.bg-color': {
                        display: 'flex',
                        flexDirection: 'column',
                        color: '#fff',
                        minHeight: '485px',
                        height: '100%',
                        borderRadius: '15px',
                        paddingBottom: '1rem',
                        position: 'relative',
                    },
                    '.btn-stake': {
                        width: 370,
                        maxWidth: '100%',
                        padding: '0.625rem 0',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        borderRadius: 12,
                    },
                    '.no-campaign': {
                        padding: '3rem 2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        justifyContent: 'center',
                        $nest: {
                            'i-label > *': {
                                fontSize: '1.5rem',
                                marginTop: '1rem',
                            }
                        }
                    }
                },
            },
            'i-modal .modal': {
                background: Theme.background.modal,
            },
            '#loadingElm.i-loading--active': {
                marginTop: '2rem',
                position: 'initial',
                $nest: {
                    '#stakingElm': {
                        display: 'none !important',
                    },
                    '.i-loading-spinner': {
                        marginTop: '2rem',
                    },
                },
            }
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
            // buttonBackgroundColor: {
            // 	type: 'string',
            // 	format: 'color'
            // },
            // buttonFontColor: {
            // 	type: 'string',
            // 	format: 'color'
            // },
            secondaryColor: {
                type: 'string',
                title: 'Timer Background Color',
                format: 'color'
            },
            secondaryFontColor: {
                type: 'string',
                title: 'Timer Font Color',
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
                logo: {
                    type: 'string',
                    title: 'Campaign Logo'
                },
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
                                {
                                    type: 'Control',
                                    scope: '#/properties/logo'
                                },
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
                                    type: 'Control',
                                    label: 'Dark',
                                    scope: '#/properties/dark'
                                },
                                {
                                    type: 'Control',
                                    label: 'Light',
                                    scope: '#/properties/light'
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
                    var _a;
                    return (_a = control.selectedNetwork) === null || _a === void 0 ? void 0 : _a.chainId;
                },
                setData: (control, value) => {
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
                    logo: {
                        type: 'string',
                        title: 'Campaign Logo'
                    },
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
                    {
                        type: 'Control',
                        scope: '#/properties/logo'
                    },
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
define("@scom/scom-staking/flow/initialSetup.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-token-list", "@scom/scom-staking/store/index.ts", "@ijstech/eth-wallet"], function (require, exports, components_8, scom_token_list_4, index_10, eth_wallet_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_8.Styles.Theme.ThemeVars;
    let ScomStakingFlowInitialSetup = class ScomStakingFlowInitialSetup extends components_8.Module {
        constructor(parent, options) {
            super(parent, options);
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
                var _a;
                let connected = (0, index_10.isClientWalletConnected)();
                this.displayWalletStatus(connected);
                await this.initWallet();
                scom_token_list_4.tokenStore.updateTokenMapData(this.executionProperties.chainId);
                const rpcWallet = this.rpcWallet;
                // let campaigns = await getAllCampaignsInfo(rpcWallet, { [this._data.chainId]: this._data });
                // let campaignInfo = campaigns[0];
                // let tokenAddress = campaignInfo.tokenAddress?.toLowerCase()
                let tokenAddress = (_a = this.tokenRequirements[0].tokenOut.address) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                this.tokenInput.chainId = this.executionProperties.chainId;
                const tokenMap = scom_token_list_4.tokenStore.getTokenMapByChainId(this.executionProperties.chainId);
                const token = tokenMap[tokenAddress];
                this.tokenInput.tokenDataListProp = [token];
                this.tokenInput.token = token;
                await scom_token_list_4.tokenStore.updateTokenBalances(rpcWallet, [token]);
            };
            this.handleClickStart = async () => {
                this.tokenInput.readOnly = true;
                let eventName = `${this.invokerId}:nextStep`;
                const tokenBalances = await scom_token_list_4.tokenStore.getTokenBalancesByChainId(this.executionProperties.chainId);
                const balance = tokenBalances[this.tokenInput.token.address.toLowerCase()];
                this.tokenRequirements[0].tokenOut.amount = this.tokenInput.value;
                this.executionProperties.stakeInputValue = this.tokenInput.value;
                const isBalanceSufficient = new eth_wallet_6.BigNumber(balance).gte(this.tokenInput.value);
                this.$eventBus.dispatch(eventName, {
                    isInitialSetup: true,
                    amount: this.tokenInput.value,
                    tokenAcquisition: !isBalanceSufficient,
                    tokenRequirements: this.tokenRequirements,
                    executionProperties: this.executionProperties
                });
            };
            this.state = new index_10.State({});
            this.$eventBus = components_8.application.EventBus;
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
            this.invokerId = value.invokerId;
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
                this.lbConnectedStatus.caption = 'Connected with ' + eth_wallet_6.Wallet.getClientInstance().address;
                this.btnConnectWallet.visible = false;
            }
            else {
                this.lbConnectedStatus.caption = 'Please connect your wallet first';
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
            super.init();
            this.tokenInput.style.setProperty('--input-background', '#232B5A');
            this.tokenInput.style.setProperty('--input-font_color', '#fff');
            this.registerEvents();
        }
        render() {
            return (this.$render("i-vstack", { gap: '1rem', padding: { top: 10, bottom: 10, left: 20, right: 20 } },
                this.$render("i-label", { caption: 'Get Ready to Stake', font: { size: '1.5rem' } }),
                this.$render("i-vstack", { gap: '1rem' },
                    this.$render("i-label", { id: "lbConnectedStatus" }),
                    this.$render("i-hstack", null,
                        this.$render("i-button", { id: "btnConnectWallet", caption: 'Connect Wallet', font: { color: Theme.colors.primary.contrastText }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }, onClick: this.connectWallet })),
                    this.$render("i-label", { caption: 'How many tokens are you planning to stake?' }),
                    this.$render("i-hstack", { verticalAlignment: 'center', width: '50%' },
                        this.$render("i-scom-token-input", { id: "tokenInput", placeholder: '0.0', value: '-', tokenReadOnly: true, isBalanceShown: false, isBtnMaxShown: false, border: { radius: '1rem' }, font: { size: '1.25rem' }, background: { color: Theme.input.background } })),
                    this.$render("i-hstack", { horizontalAlignment: 'center' },
                        this.$render("i-button", { id: "btnStart", caption: "Start", padding: { top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }, font: { color: Theme.colors.primary.contrastText, size: '1.5rem' }, onClick: this.handleClickStart }))),
                this.$render("i-scom-wallet-modal", { id: "mdWallet", wallets: [] })));
        }
    };
    ScomStakingFlowInitialSetup = __decorate([
        components_8.customModule,
        (0, components_8.customElements)('i-scom-staking-flow-initial-setup')
    ], ScomStakingFlowInitialSetup);
    exports.default = ScomStakingFlowInitialSetup;
});
define("@scom/scom-staking", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-staking/assets.ts", "@scom/scom-staking/global/index.ts", "@scom/scom-staking/store/index.ts", "@scom/scom-token-list", "@scom/scom-staking/data.json.ts", "@scom/scom-staking/staking-utils/index.ts", "@scom/scom-staking/manage-stake/index.tsx", "@scom/oswap-time-is-money-contract", "@scom/scom-staking/index.css.ts", "@scom/scom-staking/formSchema.ts", "@scom/scom-staking/flow/initialSetup.tsx"], function (require, exports, components_9, eth_wallet_7, assets_2, index_11, index_12, scom_token_list_5, data_json_1, index_13, index_14, oswap_time_is_money_contract_2, index_css_2, formSchema_1, initialSetup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_9.Styles.Theme.ThemeVars;
    let ScomStaking = class ScomStaking extends components_9.Module {
        _getActions(category) {
            const actions = [];
            if (category && category !== 'offers') {
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
                                const { chainId, name, desc, logo, getTokenURL, showContractLink, staking } = userInputData, themeSettings = __rest(userInputData, ["chainId", "name", "desc", "logo", "getTokenURL", "showContractLink", "staking"]);
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
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
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
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
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
                        var _a, _b, _c;
                        const address = (_c = (_b = (_a = this.campaign) === null || _a === void 0 ? void 0 : _a.option) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.address;
                        const selectors = await (0, index_13.getProxySelectors)(this.state, chainId, address);
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
                        await this.setData(Object.assign(Object.assign({}, defaultData), data));
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
                            let resultingData = Object.assign(Object.assign({}, self._data), { commissions });
                            await this.setData(resultingData);
                        }
                    },
                    bindOnChanged: (element, callback) => {
                        element.onChanged = async (data) => {
                            let resultingData = Object.assign(Object.assign({}, self._data), data);
                            await this.setData(resultingData);
                            await callback(data);
                        };
                    },
                    getData: () => {
                        const fee = this.state.embedderCommissionFee;
                        return Object.assign(Object.assign({}, this.getData()), { fee });
                    },
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
            var _a;
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
                networks: this.networks,
                showHeader: this.showHeader,
                rpcWalletId: rpcWallet.instanceId
            };
            if ((_a = this.dappContainer) === null || _a === void 0 ? void 0 : _a.setData)
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
            var _a;
            this.tag[type] = (_a = this.tag[type]) !== null && _a !== void 0 ? _a : {};
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
            // if (this.stakingElm) {
            // 	this.renderCampaign();
            // }
        }
        updateStyle(name, value) {
            value ?
                this.style.setProperty(name, value) :
                this.style.removeProperty(name);
        }
        updateTheme() {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const themeVar = ((_a = this.dappContainer) === null || _a === void 0 ? void 0 : _a.theme) || 'light';
            this.updateStyle('--text-primary', (_b = this.tag[themeVar]) === null || _b === void 0 ? void 0 : _b.fontColor);
            this.updateStyle('--background-main', (_c = this.tag[themeVar]) === null || _c === void 0 ? void 0 : _c.backgroundColor);
            this.updateStyle('--text-secondary', (_d = this.tag[themeVar]) === null || _d === void 0 ? void 0 : _d.textSecondary);
            // this.updateStyle('--colors-primary-main', this.tag[themeVar]?.buttonBackgroundColor);
            // this.updateStyle('--colors-primary-contrast_text', this.tag[themeVar]?.buttonFontColor);
            this.updateStyle('--colors-secondary-main', (_e = this.tag[themeVar]) === null || _e === void 0 ? void 0 : _e.secondaryColor);
            this.updateStyle('--colors-secondary-contrast_text', (_f = this.tag[themeVar]) === null || _f === void 0 ? void 0 : _f.secondaryFontColor);
            this.updateStyle('--input-font_color', (_g = this.tag[themeVar]) === null || _g === void 0 ? void 0 : _g.inputFontColor);
            this.updateStyle('--input-background', (_h = this.tag[themeVar]) === null || _h === void 0 ? void 0 : _h.inputBackgroundColor);
        }
        get wallets() {
            var _a;
            return (_a = this._data.wallets) !== null && _a !== void 0 ? _a : [];
        }
        set wallets(value) {
            this._data.wallets = value;
        }
        get networks() {
            var _a;
            return (_a = this._data.networks) !== null && _a !== void 0 ? _a : [];
        }
        set networks(value) {
            this._data.networks = value;
        }
        get showHeader() {
            var _a;
            return (_a = this._data.showHeader) !== null && _a !== void 0 ? _a : true;
        }
        set showHeader(value) {
            this._data.showHeader = value;
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
            this.rpcWalletEvents = [];
            this.onChainChanged = async () => {
                if (await this.isWalletValid()) {
                    this.initializeWidgetConfig();
                }
            };
            this.isWalletValid = async () => {
                var _a;
                if (this._data && (0, index_12.isClientWalletConnected)()) {
                    try {
                        const wallet = eth_wallet_7.Wallet.getClientInstance();
                        const infoList = this._data[wallet.chainId];
                        const stakingAddress = infoList && ((_a = infoList[0].staking) === null || _a === void 0 ? void 0 : _a.address);
                        if (stakingAddress) {
                            const timeIsMoney = new oswap_time_is_money_contract_2.Contracts.TimeIsMoney(wallet, stakingAddress);
                            await timeIsMoney.getCredit(wallet.address);
                        }
                        return true;
                    }
                    catch (_b) {
                        return false;
                    }
                }
                return false;
            };
            this.refreshUI = () => {
                this.initializeWidgetConfig();
            };
            this.initializeWidgetConfig = (hideLoading) => {
                setTimeout(async () => {
                    if (!hideLoading && this.loadingElm) {
                        this.loadingElm.visible = true;
                    }
                    if (!(0, index_12.isClientWalletConnected)() || !this._data || !this.checkValidation()) {
                        await this.renderEmpty();
                        return;
                    }
                    await this.initWallet();
                    scom_token_list_5.tokenStore.updateTokenMapData(this.chainId);
                    const rpcWallet = this.rpcWallet;
                    if (rpcWallet.address) {
                        await scom_token_list_5.tokenStore.updateAllTokenBalances(rpcWallet);
                    }
                    this.campaign = await (0, index_13.getCampaignInfo)(rpcWallet, { [this._data.chainId]: this._data });
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
                this.txStatusModal.message = Object.assign({}, params);
                this.txStatusModal.showModal();
            };
            this.onClaim = async (btnClaim, data) => {
                this.showMessage('warning', `Claim ${data.rewardSymbol}`);
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
                (0, index_11.registerSendTxEvents)({
                    transactionHash: callBack,
                    confirmation: confirmationCallBack
                });
                (0, index_13.claimToken)(data.reward.address, callBack);
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
                return this.tokenMap[tokenAddress] || this.tokenMap[tokenAddress === null || tokenAddress === void 0 ? void 0 : tokenAddress.toLocaleLowerCase()] || {};
            };
            this.getLPToken = (campaign, token, chainId) => {
                if (campaign.getTokenURL) {
                    window.open(campaign.getTokenURL);
                }
                else {
                    window.open(index_12.getTokenUrl ? index_12.getTokenUrl : `https:openswap.xyz/#/swap?chainId=${chainId}&fromToken=BNB&toToken=${token}&fromAmount=1&showOptimizedRoutes=false`);
                }
            };
            this.connectWallet = async () => {
                if (!(0, index_12.isClientWalletConnected)()) {
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
                const isClientConnected = (0, index_12.isClientWalletConnected)();
                // const isRpcConnected = this.state.isRpcWalletConnected();
                this.noCampaignSection.clearInnerHTML();
                this.noCampaignSection.appendChild(this.$render("i-panel", { class: "no-campaign", height: "100%", background: { color: Theme.background.main } },
                    this.$render("i-vstack", { gap: 10, verticalAlignment: "center" },
                        this.$render("i-image", { url: assets_2.default.fullPath('img/staking/TrollTrooper.svg') }),
                        this.$render("i-label", { caption: isClientConnected ? 'No Campaigns' : 'Please connect with your wallet!' }))));
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
                containerSection.classList.add('container');
                let opt = Object.assign({}, campaign.option);
                let lpTokenData = {};
                let vaultTokenData = {};
                if (opt.tokenAddress) {
                    if (opt.lockTokenType == index_11.LockTokenType.LP_Token) {
                        lpTokenData = {
                            'object': await (0, index_13.getLPObject)(rpcWallet, opt.tokenAddress)
                        };
                    }
                    else if (opt.lockTokenType == index_11.LockTokenType.VAULT_Token) {
                        vaultTokenData = {
                            'object': await (0, index_13.getVaultObject)(rpcWallet, opt.tokenAddress)
                        };
                    }
                }
                const tokenInfo = {
                    tokenAddress: campaign.tokenAddress,
                    lpToken: lpTokenData,
                    vaultToken: vaultTokenData
                };
                opt = Object.assign(Object.assign({}, opt), { tokenInfo });
                const stakingInfo = opt;
                const lockedTokenObject = (0, index_12.getLockedTokenObject)(stakingInfo, stakingInfo.tokenInfo, this.tokenMap);
                const lockedTokenSymbol = (0, index_12.getLockedTokenSymbol)(stakingInfo, lockedTokenObject);
                const lockedTokenIconPaths = (0, index_12.getLockedTokenIconPaths)(stakingInfo, lockedTokenObject, chainId, this.tokenMap);
                const lockedTokenDecimals = (lockedTokenObject === null || lockedTokenObject === void 0 ? void 0 : lockedTokenObject.decimals) || 18;
                const defaultDecimalsOffset = 18 - lockedTokenDecimals;
                const activeStartTime = stakingInfo ? stakingInfo.startOfEntryPeriod : 0;
                const activeEndTime = stakingInfo ? stakingInfo.endOfEntryPeriod : 0;
                let isStarted = (0, components_9.moment)(activeStartTime).diff((0, components_9.moment)()) <= 0;
                let isClosed = (0, components_9.moment)(activeEndTime).diff((0, components_9.moment)()) <= 0;
                let totalLocked = {};
                const optionTimer = { background: { color: Theme.colors.secondary.main }, font: { color: Theme.colors.secondary.contrastText } };
                const stakingElm = await components_9.VStack.create();
                const activeTimerRow = await components_9.VStack.create({ gap: 2, width: '25%', verticalAlignment: 'center' });
                const activeTimerElm = await components_9.VStack.create();
                activeTimerRow.appendChild(this.$render("i-label", { caption: "End Date", font: { size: '14px' }, opacity: 0.5 }));
                activeTimerRow.appendChild(activeTimerElm);
                const endHour = await components_9.Label.create(optionTimer);
                const endDay = await components_9.Label.create(optionTimer);
                const endMin = await components_9.Label.create(optionTimer);
                endHour.classList.add('timer-value');
                endDay.classList.add('timer-value');
                endMin.classList.add('timer-value');
                activeTimerElm.appendChild(this.$render("i-hstack", { gap: 4, class: "custom-timer" },
                    endDay,
                    this.$render("i-label", { caption: "D", class: "timer-unit" }),
                    endHour,
                    this.$render("i-label", { caption: "H", class: "timer-unit" }),
                    endMin,
                    this.$render("i-label", { caption: "M", class: "timer-unit" })));
                // Sticker
                const stickerSection = await components_9.Panel.create({ visible: false });
                const stickerLabel = await components_9.Label.create();
                const stickerIcon = await components_9.Icon.create({ fill: '#fff' });
                stickerSection.classList.add('sticker');
                stickerSection.appendChild(this.$render("i-vstack", { class: "sticker-text" },
                    stickerIcon,
                    stickerLabel));
                const setAvailableQty = async () => {
                    if (!this.state.isRpcWalletConnected() || !this.manageStake)
                        return;
                    const o = opt;
                    const _totalLocked = await (0, index_13.getStakingTotalLocked)(rpcWallet, o.address);
                    totalLocked[o.address] = _totalLocked;
                    const optionQty = new eth_wallet_7.BigNumber(o.maxTotalLock).minus(_totalLocked).shiftedBy(defaultDecimalsOffset);
                    if (o.mode === 'Stake') {
                        const btnStake = this.manageStake.btnStake;
                        const isStaking = this.state.getStakingStatus(index_11.CurrentMode.STAKE);
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
                        const isUnstaking = this.state.getStakingStatus(index_11.CurrentMode.UNLOCK);
                        if (btnUnstake) {
                            btnUnstake.enabled = !isUnstaking && o.mode !== 'Stake' && Number(o.stakeQty) != 0 && !this.manageStake.needToBeApproval();
                        }
                    }
                    if (isClosed) {
                        if (stickerLabel.caption !== 'Closed') {
                            stickerSection.classList.add('closed');
                            stickerSection.classList.remove('sold-out');
                            stickerLabel.caption = 'Closed';
                            stickerIcon.name = 'check-square';
                        }
                    }
                    else if (optionQty.lte(0)) {
                        if (stickerLabel.caption !== 'Sold Out') {
                            stickerLabel.caption = 'Sold Out';
                            stickerIcon.name = 'star';
                            stickerSection.classList.add('sold-out');
                        }
                    }
                    else {
                        if (stickerLabel.caption !== 'Active') {
                            stickerLabel.caption = 'Active';
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
                    activeTimerRow.visible = isStarted && !isClosed;
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
                const option = Object.assign({}, opt);
                this.manageStake = new index_14.default(undefined, {
                    width: '100%',
                });
                this.manageStake.state = this.state;
                this.manageStake.onRefresh = () => this.initializeWidgetConfig(true);
                const isClaim = option.mode === 'Claim';
                const rewardsData = option.rewardsData[0] ? [option.rewardsData[0]] : [];
                const rewardOptions = !isClaim ? rewardsData : [];
                let aprInfo = {};
                const claimStakedRow = await components_9.HStack.create({ verticalAlignment: 'center', horizontalAlignment: 'space-between' });
                claimStakedRow.appendChild(this.$render("i-label", { caption: "You Staked", font: { size: '16px' } }));
                claimStakedRow.appendChild(this.$render("i-label", { caption: `${(0, index_11.formatNumber)(new eth_wallet_7.BigNumber(option.stakeQty).shiftedBy(defaultDecimalsOffset))} ${lockedTokenSymbol}`, font: { size: '16px' } }));
                const rowRewards = await components_9.VStack.create({ gap: 8, verticalAlignment: 'center' });
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
                        this.$render("i-label", { caption: `${rewardSymbol} Locked`, font: { size: '16px', color: Theme.text.primary } }),
                        this.$render("i-label", { caption: `${(0, index_11.formatNumber)(new eth_wallet_7.BigNumber(reward.vestedReward || 0).shiftedBy(rewardLockedDecimalsOffset))} ${rewardSymbol}`, font: { size: '16px' } })));
                    // rowRewards.appendChild(
                    // 	<i-hstack horizontalAlignment="space-between">
                    // 		<i-label caption={`${rewardSymbol} Vesting Start`} font={{ size: '16px', color: colorText }} />
                    // 		<i-label caption={reward.vestingStart ? reward.vestingStart.format('YYYY-MM-DD HH:mm:ss') : 'TBC'} font={{ size: '16px', color: colorText }} />
                    // 	</i-hstack>
                    // );
                    // rowRewards.appendChild(
                    // 	<i-hstack horizontalAlignment="space-between">
                    // 		<i-label caption={`${rewardSymbol} Vesting End`} font={{ size: '16px', color: colorText }} />
                    // 		<i-label caption={reward.vestingEnd ? reward.vestingEnd.format('YYYY-MM-DD HH:mm:ss') : 'TBC'} font={{ size: '16px', color: colorText }} />
                    // 	</i-hstack>
                    // );
                    const passClaimStartTime = !(reward.claimStartTime && (0, components_9.moment)().diff(components_9.moment.unix(reward.claimStartTime)) < 0);
                    let rewardClaimable = `0 ${rewardSymbol}`;
                    if (passClaimStartTime && isClaim) {
                        rewardClaimable = `${(0, index_11.formatNumber)(new eth_wallet_7.BigNumber(reward.claimable).shiftedBy(decimalsOffset))} ${rewardSymbol}`;
                    }
                    let startClaimingText = '';
                    if (!(!reward.claimStartTime || passClaimStartTime) && isClaim) {
                        const claimStart = components_9.moment.unix(reward.claimStartTime).format('YYYY-MM-DD HH:mm:ss');
                        startClaimingText = `(Claim ${rewardSymbol} after ${claimStart})`;
                    }
                    rowRewards.appendChild(this.$render("i-hstack", { horizontalAlignment: "space-between" },
                        this.$render("i-label", { caption: `${rewardSymbol} Claimable`, font: { size: '16px' } }),
                        this.$render("i-label", { caption: rewardClaimable, font: { size: '16px' } }),
                        startClaimingText ? this.$render("i-label", { caption: startClaimingText, font: { size: '16px' } }) : []));
                    const btnClaim = await components_9.Button.create({
                        // rightIcon: { spin: true, fill: Theme.colors.primary.contrastText, visible: false },
                        rightIcon: { spin: true, fill: '#fff', visible: false },
                        caption: rpcWalletConnected ? `Claim ${rewardSymbol}` : 'Switch Network',
                        // background: { color: `${Theme.colors.primary.main} !important` },
                        // font: { color: Theme.colors.primary.contrastText },
                        enabled: !rpcWalletConnected || (rpcWalletConnected && !(!passClaimStartTime || new eth_wallet_7.BigNumber(reward.claimable).isZero()) && isClaim),
                        margin: { left: 'auto', right: 'auto', bottom: 10 }
                    });
                    btnClaim.classList.add('btn-os', 'btn-stake');
                    btnClaim.onClick = () => rpcWalletConnected ? this.onClaim(btnClaim, { reward, rewardSymbol }) : this.connectWallet();
                    rowRewards.appendChild(btnClaim);
                }
                ;
                const getAprValue = (rewardOption) => {
                    if (rewardOption && aprInfo && aprInfo[rewardOption.rewardTokenAddress]) {
                        const apr = new eth_wallet_7.BigNumber(aprInfo[rewardOption.rewardTokenAddress]).times(100).toFormat(2, eth_wallet_7.BigNumber.ROUND_DOWN);
                        return `${apr}%`;
                    }
                    return '';
                };
                const durationDays = option.minLockTime / (60 * 60 * 24);
                const _lockedTokenObject = (0, index_12.getLockedTokenObject)(option, option.tokenInfo, this.tokenMap);
                const _lockedTokenIconPaths = (0, index_12.getLockedTokenIconPaths)(option, _lockedTokenObject, chainId, this.tokenMap);
                const pathsLength = _lockedTokenIconPaths.length;
                const rewardToken = (rewardsData === null || rewardsData === void 0 ? void 0 : rewardsData.length) ? this.getRewardToken(rewardsData[0].rewardTokenAddress) : null;
                stakingElm.appendChild(this.$render("i-vstack", { gap: 15, width: index_12.maxWidth, height: "100%", padding: { top: 10, bottom: 10, left: 20, right: 20 }, position: "relative" },
                    stickerSection,
                    this.$render("i-hstack", { gap: 10, width: "100%", verticalAlignment: "center" },
                        this.$render("i-hstack", { gap: 10, width: "50%" },
                            this.$render("i-hstack", { width: pathsLength === 1 ? 63.5 : 80, position: "relative", verticalAlignment: "center" },
                                this.$render("i-image", { width: 60, height: 60, url: scom_token_list_5.assets.tokenPath(rewardToken, chainId), fallbackUrl: index_12.fallBackUrl }),
                                _lockedTokenIconPaths.map((v, idxImg) => {
                                    return this.$render("i-image", { position: "absolute", width: 28, height: 28, bottom: 0, left: (idxImg * 20) + 35, url: scom_token_list_5.assets.fullPath(v), fallbackUrl: index_12.fallBackUrl });
                                })),
                            this.$render("i-vstack", { gap: 2, overflow: { x: 'hidden' }, verticalAlignment: "center" },
                                this.$render("i-label", { visible: !!campaign.name, caption: campaign.name, font: { size: '20px', color: Theme.text.secondary, bold: true }, class: "text-overflow" }),
                                this.$render("i-label", { visible: !!campaign.desc, caption: campaign.desc, font: { size: '16px' }, opacity: 0.5, class: "text-overflow" }))),
                        await Promise.all(rewardOptions.map(async (rewardOption, idx) => {
                            const lbApr = await components_9.Label.create({ font: { size: '32px', color: Theme.text.secondary } });
                            const lbRate = await components_9.Label.create({ font: { size: '16px' }, opacity: 0.5 });
                            lbApr.classList.add('text-overflow');
                            const rewardToken = this.getRewardToken(rewardOption.rewardTokenAddress);
                            const rewardTokenDecimals = rewardToken.decimals || 18;
                            const decimalsOffset = 18 - rewardTokenDecimals;
                            const lockTokenType = option.lockTokenType;
                            // const rateDesc = `1 ${lockTokenType === LockTokenType.LP_Token ? 'LP' : tokenSymbol(option.lockTokenAddress)} : ${new BigNumber(rewardOption.multiplier).shiftedBy(decimalsOffset).toFixed()} ${tokenSymbol(rewardOption.rewardTokenAddress)}`;
                            const rateDesc = `1 ${lockTokenType === index_11.LockTokenType.LP_Token ? 'LP' : (0, index_12.tokenSymbol)(this.chainId, option.lockTokenAddress)} : ${rewardOption.multiplier} ${(0, index_12.tokenSymbol)(this.chainId, rewardOption.rewardTokenAddress)}`;
                            const updateApr = async () => {
                                var _a, _b, _c, _d;
                                if (lockTokenType === index_11.LockTokenType.ERC20_Token) {
                                    const apr = await (0, index_13.getERC20RewardCurrentAPR)(rpcWallet, rewardOption, lockedTokenObject, durationDays);
                                    if (!isNaN(parseFloat(apr))) {
                                        aprInfo[rewardOption.rewardTokenAddress] = apr;
                                    }
                                }
                                else if (lockTokenType === index_11.LockTokenType.LP_Token) {
                                    if (rewardOption.referencePair) {
                                        aprInfo[rewardOption.rewardTokenAddress] = await (0, index_13.getLPRewardCurrentAPR)(rpcWallet, rewardOption, (_b = (_a = option.tokenInfo) === null || _a === void 0 ? void 0 : _a.lpToken) === null || _b === void 0 ? void 0 : _b.object, durationDays);
                                    }
                                }
                                else {
                                    aprInfo[rewardOption.rewardTokenAddress] = await (0, index_13.getVaultRewardCurrentAPR)(rpcWallet, rewardOption, (_d = (_c = option.tokenInfo) === null || _c === void 0 ? void 0 : _c.vaultToken) === null || _d === void 0 ? void 0 : _d.object, durationDays);
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
                            return this.$render("i-vstack", { verticalAlignment: "center" },
                                lbApr,
                                lbRate);
                        }))),
                    this.$render("i-hstack", { width: "100%", verticalAlignment: "center" },
                        this.$render("i-vstack", { gap: 2, width: "25%", verticalAlignment: "center" },
                            this.$render("i-label", { caption: "Start Date", font: { size: '14px' }, opacity: 0.5 }),
                            this.$render("i-label", { caption: (0, index_11.formatDate)(option.startOfEntryPeriod, 'DD MMM, YYYY'), font: { size: '16px' } })),
                        activeTimerRow,
                        this.$render("i-vstack", { gap: 2, width: "25%", verticalAlignment: "center" },
                            this.$render("i-label", { caption: "Stake Duration", font: { size: '14px' }, opacity: 0.5 }),
                            this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                                this.$render("i-button", { caption: durationDays < 1 ? '< 1 Day' : `${durationDays} Days`, class: "btn-os cursor-default", border: { radius: 12, width: 1, style: 'solid', color: 'transparent' }, font: { size: '12px', color: Theme.colors.secondary.contrastText }, padding: { top: 2.5, bottom: 2.5, left: 8, right: 8 }, background: { color: `${Theme.colors.secondary.main} !important` } }))),
                        this.$render("i-vstack", { gap: 4, width: "25%", margin: { left: 'auto' }, verticalAlignment: "center", horizontalAlignment: "end" },
                            this.$render("i-hstack", { gap: 4, class: "pointer", width: "fit-content", verticalAlignment: "center", onClick: () => this.getLPToken(campaign, lockedTokenSymbol, chainId) },
                                this.$render("i-icon", { name: "external-link-alt", width: 12, height: 12, fill: Theme.text.primary }),
                                this.$render("i-label", { caption: `Get ${lockedTokenSymbol}`, font: { size: '13.6px' } }),
                                lockedTokenIconPaths.map((v) => {
                                    return this.$render("i-image", { display: "flex", width: 15, height: 15, url: scom_token_list_5.assets.fullPath(v), fallbackUrl: index_12.fallBackUrl });
                                })),
                            campaign.showContractLink ?
                                this.$render("i-hstack", { gap: 4, class: "pointer", width: "fit-content", verticalAlignment: "center", onClick: () => (0, index_12.viewOnExplorerByAddress)(chainId, option.address) },
                                    this.$render("i-icon", { name: "external-link-alt", width: 12, height: 12, fill: Theme.text.primary, class: "inline-block" }),
                                    this.$render("i-label", { caption: "View Contract", font: { size: '13.6px' } })) : [])),
                    this.$render("i-vstack", { gap: 8 },
                        claimStakedRow,
                        this.$render("i-vstack", { verticalAlignment: "center", horizontalAlignment: "center" }, this.manageStake),
                        rowRewards)));
                await this.manageStake.setData(Object.assign(Object.assign({}, campaign), option));
                if (this._data.stakeInputValue) {
                    this.manageStake.setInputValue(this._data.stakeInputValue);
                }
                containerSection.appendChild(this.$render("i-hstack", { background: { color: Theme.background.main }, width: "100%", height: index_12.maxHeight, border: { width: 1, style: 'solid', color: '#7979794a' } }, stakingElm));
                this.stakingElm.clearInnerHTML();
                this.stakingElm.append(this.noCampaignSection, containerSection);
            };
            this.state = new index_12.State(data_json_1.default);
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
            this.isReadyCallbackQueued = true;
            super.init();
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                const data = this.getAttribute('data', true);
                if (data) {
                    await this.setData(data);
                }
                else {
                    this.renderEmpty();
                }
            }
            this.isReadyCallbackQueued = false;
            this.executeReadyCallback();
        }
        render() {
            return (this.$render("i-scom-dapp-container", { id: "dappContainer", class: index_css_2.stakingDappContainer },
                this.$render("i-panel", { class: index_css_2.stakingComponent, minHeight: 200 },
                    this.$render("i-panel", { id: "stakingLayout", class: "staking-layout", width: index_12.maxWidth, height: index_12.maxHeight, margin: { left: 'auto', right: 'auto' } },
                        this.$render("i-vstack", { id: "loadingElm", class: "i-loading-overlay" },
                            this.$render("i-vstack", { class: "i-loading-spinner", horizontalAlignment: "center", verticalAlignment: "center" },
                                this.$render("i-icon", { class: "i-loading-spinner_icon", image: { url: assets_2.default.fullPath('img/loading.svg'), width: 36, height: 36 } }),
                                this.$render("i-label", { caption: "Loading...", font: { color: '#FD4A4C', size: '1.5em' }, class: "i-loading-spinner_text" }))),
                        this.$render("i-panel", { id: "stakingElm", class: "wrapper" })),
                    this.$render("i-scom-wallet-modal", { id: "mdWallet", wallets: [] }),
                    this.$render("i-scom-tx-status-modal", { id: "txStatusModal" }))));
        }
        async handleFlowStage(target, stage, options) {
            let widget;
            if (stage === 'initialSetup') {
                widget = new initialSetup_1.default();
                target.appendChild(widget);
                await widget.ready();
                let properties = options.properties;
                let tokenRequirements = options.tokenRequirements;
                let invokerId = options.invokerId;
                this.state.setFlowInvokerId(invokerId);
                await widget.setData({
                    executionProperties: properties,
                    tokenRequirements,
                    invokerId
                });
            }
            else {
                widget = this;
                target.appendChild(widget);
                await this.ready();
                let properties = options.properties;
                let tag = options.tag;
                let invokerId = options.invokerId;
                this.state.setFlowInvokerId(invokerId);
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
    ScomStaking = __decorate([
        components_9.customModule,
        (0, components_9.customElements)('i-scom-staking')
    ], ScomStaking);
    exports.default = ScomStaking;
});
