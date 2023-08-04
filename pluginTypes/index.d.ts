/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dapp-container/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@ijstech/eth-contract/index.d.ts" />
/// <amd-module name="@scom/scom-staking/assets.ts" />
declare module "@scom/scom-staking/assets.ts" {
    function fullPath(path: string): string;
    const _default: {
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-staking/global/utils/helper.ts" />
declare module "@scom/scom-staking/global/utils/helper.ts" {
    export const DefaultDateFormat = "DD/MM/YYYY";
    export const formatDate: (date: any, customType?: string, showTimezone?: boolean) => string;
    export const formatNumber: (value: any, decimals?: number) => string;
    export const formatNumberWithSeparators: (value: number, precision?: number) => string;
    export const isInvalidInput: (val: any) => boolean;
    export const limitInputNumber: (input: any, decimals?: number) => void;
    export const limitDecimals: (value: any, decimals: number) => any;
}
/// <amd-module name="@scom/scom-staking/global/utils/common.ts" />
declare module "@scom/scom-staking/global/utils/common.ts" {
    import { ISendTxEventsOptions } from "@ijstech/eth-wallet";
    import { ITokenObject } from "@scom/scom-token-list";
    export type TokenMapType = {
        [token: string]: ITokenObject;
    };
    export const registerSendTxEvents: (sendTxEventHandlers: ISendTxEventsOptions) => void;
}
/// <amd-module name="@scom/scom-staking/global/utils/interfaces.ts" />
declare module "@scom/scom-staking/global/utils/interfaces.ts" {
    import { BigNumber, IClientSideProvider } from "@ijstech/eth-wallet";
    export interface ICommissionInfo {
        chainId: number;
        walletAddress: string;
        share: string;
    }
    export enum LockTokenType {
        ERC20_Token = 0,
        LP_Token = 1,
        VAULT_Token = 2
    }
    export interface ISingleStakingCampaign {
        chainId: number;
        customName: string;
        customDesc?: string;
        customLogo?: string;
        getTokenURL?: string;
        showContractLink?: boolean;
        stakings: ISingleStaking;
        commissions?: ICommissionInfo[];
        wallets: IWalletPlugin[];
        networks: INetworkConfig[];
        showHeader?: boolean;
        defaultChainId?: number;
    }
    export interface ISingleStaking {
        address: string;
        customDesc?: string;
        lockTokenType: LockTokenType;
        rewards: ISingleReward;
    }
    export interface ISingleReward {
        address: string;
        isCommonStartDate?: boolean;
    }
    export interface IStakingCampaign {
        chainId: number;
        customName: string;
        customDesc?: string;
        customLogo?: string;
        getTokenURL?: string;
        campaignStart: BigNumber;
        campaignEnd: BigNumber;
        showContractLink?: boolean;
        admin: string;
        stakings: Staking[];
    }
    export interface IWalletPlugin {
        name: string;
        packageName?: string;
        provider?: IClientSideProvider;
    }
    export interface INetworkConfig {
        chainId: number;
        chainName?: string;
    }
    export interface RewardNeeded {
        value: BigNumber;
        tokenAddress: string;
    }
    export interface Staking {
        address?: string;
        lockTokenAddress: string;
        minLockTime: BigNumber;
        perAddressCap: BigNumber;
        maxTotalLock: BigNumber;
        customDesc?: string;
        lockTokenType: LockTokenType;
        decimalsOffset?: number;
        rewards: Reward[];
    }
    export interface Reward {
        address?: string;
        rewardTokenAddress: string;
        multiplier: BigNumber;
        rewardAmount?: BigNumber;
        initialReward: BigNumber;
        vestingPeriod: BigNumber;
        claimDeadline: BigNumber;
        admin: string;
        isCommonStartDate?: boolean;
        vestingStartDate?: BigNumber;
    }
}
/// <amd-module name="@scom/scom-staking/global/utils/index.ts" />
declare module "@scom/scom-staking/global/utils/index.ts" {
    export * from "@scom/scom-staking/global/utils/helper.ts";
    export { registerSendTxEvents, TokenMapType } from "@scom/scom-staking/global/utils/common.ts";
    export * from "@scom/scom-staking/global/utils/interfaces.ts";
}
/// <amd-module name="@scom/scom-staking/global/index.ts" />
declare module "@scom/scom-staking/global/index.ts" {
    export const enum EventId {
        Paid = "Paid",
        EmitButtonStatus = "stakingEmitButtonStatus"
    }
    export * from "@scom/scom-staking/global/utils/index.ts";
}
/// <amd-module name="@scom/scom-staking/store/data/index.ts" />
declare module "@scom/scom-staking/store/data/index.ts" {
    const USDPeggedTokenAddressMap: {
        [key: number]: string;
    };
    export { USDPeggedTokenAddressMap };
}
/// <amd-module name="@scom/scom-staking/store/utils.ts" />
declare module "@scom/scom-staking/store/utils.ts" {
    import { ERC20ApprovalModel, IERC20ApprovalEventOptions, INetwork } from '@ijstech/eth-wallet';
    export * from "@scom/scom-staking/store/data/index.ts";
    export type ProxyAddresses = {
        [key: number]: string;
    };
    export class State {
        networkMap: {
            [key: number]: INetwork;
        };
        infuraId: string;
        stakingStatusMap: {
            [key: string]: {
                value: boolean;
                text: string;
            };
        };
        proxyAddresses: ProxyAddresses;
        embedderCommissionFee: string;
        rpcWalletId: string;
        approvalModel: ERC20ApprovalModel;
        constructor(options: any);
        initRpcWallet(defaultChainId: number): string;
        private initData;
        private setNetworkList;
        getProxyAddress(chainId?: number): string;
        setStakingStatus(key: string, value: boolean, text: string): void;
        getStakingStatus(key: string): {
            value: boolean;
            text: string;
        };
        getRpcWallet(): import("@ijstech/eth-wallet").IRpcWallet;
        isRpcWalletConnected(): boolean;
        getChainId(): number;
        setApprovalModelAction(options: IERC20ApprovalEventOptions): Promise<import("@ijstech/eth-wallet").IERC20ApprovalAction>;
    }
    export function isClientWalletConnected(): boolean;
}
/// <amd-module name="@scom/scom-staking/store/index.ts" />
declare module "@scom/scom-staking/store/index.ts" {
    import { ITokenObject } from '@scom/scom-token-list';
    export const fallBackUrl: string;
    export const getChainNativeToken: (chainId: number) => ITokenObject;
    export const getNetworkInfo: (chainId: number) => any;
    export const viewOnExplorerByAddress: (chainId: number, address: string) => void;
    export const tokenSymbol: (address: string) => string;
    export const getLockedTokenObject: (info: any, tokenInfo: any, tokenMap?: any) => any;
    export const getLockedTokenSymbol: (info: any, token: any) => any;
    export const getLockedTokenIconPaths: (info: any, tokenObject: any, chainId: number, tokenMap?: any) => string[];
    export const getTokenDecimals: (address: string, chainId: number) => number;
    export const baseUrl = "https://openswap.xyz/#";
    export const getTokenUrl: string;
    export const maxWidth = "690px";
    export const maxHeight = 321;
    export * from "@scom/scom-staking/store/utils.ts";
}
/// <amd-module name="@scom/scom-staking/data.json.ts" />
declare module "@scom/scom-staking/data.json.ts" {
    const _default_1: {
        infuraId: string;
        networks: {
            chainId: number;
            explorerName: string;
            explorerTxUrl: string;
            explorerAddressUrl: string;
        }[];
        proxyAddresses: {
            "97": string;
            "43113": string;
        };
        embedderCommissionFee: string;
        defaultBuilderData: {
            defaultChainId: number;
            chainId: number;
            customName: string;
            customDesc: string;
            showContractLink: boolean;
            stakings: {
                address: string;
                lockTokenType: number;
                rewards: {
                    address: string;
                    isCommonStartDate: boolean;
                };
            };
            networks: {
                chainId: number;
            }[];
            wallets: {
                name: string;
            }[];
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-staking/staking-utils/index.ts" />
declare module "@scom/scom-staking/staking-utils/index.ts" {
    import { BigNumber, IWallet } from "@ijstech/eth-wallet";
    import { ISingleStakingCampaign } from "@scom/scom-staking/global/index.ts";
    import { ITokenObject } from '@scom/scom-token-list';
    export const getTokenPrice: (wallet: IWallet, token: string) => Promise<string>;
    const getAllCampaignsInfo: (wallet: IWallet, stakingInfo: {
        [key: number]: ISingleStakingCampaign;
    }) => Promise<any[]>;
    const getStakingTotalLocked: (wallet: IWallet, stakingAddress: string) => Promise<string>;
    const getLPObject: (wallet: IWallet, pairAddress: string) => Promise<{
        address: string;
        decimals: string;
        name: string;
        symbol: string;
        token0: string;
        token1: string;
    }>;
    const getLPBalance: (wallet: IWallet, pairAddress: string) => Promise<string>;
    const getVaultObject: (wallet: IWallet, vaultAddress: string) => Promise<{
        address: string;
        decimals: BigNumber;
        name: string;
        symbol: string;
        assetToken: any;
    } | {
        address?: undefined;
        decimals?: undefined;
        name?: undefined;
        symbol?: undefined;
        assetToken?: undefined;
    }>;
    const getVaultBalance: (wallet: IWallet, vaultAddress: string) => Promise<string>;
    const getERC20RewardCurrentAPR: (wallet: IWallet, rewardOption: any, lockedToken: any, lockedDays: number) => Promise<string>;
    const getLPRewardCurrentAPR: (wallet: IWallet, rewardOption: any, lpObject: any, lockedDays: number) => Promise<string>;
    const getVaultRewardCurrentAPR: (wallet: IWallet, rewardOption: any, vaultObject: any, lockedDays: number) => Promise<string>;
    const withdrawToken: (contractAddress: string, callback?: any) => Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    const claimToken: (contractAddress: string, callback?: any) => Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    const lockToken: (token: ITokenObject, amount: string, contractAddress: string, callback?: any) => Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    export { getAllCampaignsInfo, getStakingTotalLocked, getLPObject, getLPBalance, getVaultObject, getVaultBalance, getERC20RewardCurrentAPR, getLPRewardCurrentAPR, getVaultRewardCurrentAPR, withdrawToken, claimToken, lockToken };
}
/// <amd-module name="@scom/scom-staking/manage-stake/index.css.ts" />
declare module "@scom/scom-staking/manage-stake/index.css.ts" {
    export const stakingManageStakeStyle: string;
}
/// <amd-module name="@scom/scom-staking/manage-stake/index.tsx" />
declare module "@scom/scom-staking/manage-stake/index.tsx" {
    import { Container, ControlElement, Module } from '@ijstech/components';
    import { BigNumber } from '@ijstech/eth-wallet';
    import { State } from "@scom/scom-staking/store/index.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['staking-manage-stake']: ControlElement;
            }
        }
    }
    export default class ManageStake extends Module {
        private _state;
        private stakingInfo;
        private address;
        private lockedTokenObject;
        private maxQty;
        private availableQty;
        private balance;
        private perAddressCap;
        private stakeQty;
        private tokenSymbol;
        private currentMode;
        private tokenBalances;
        private tokenMap;
        private lbToken;
        private wrapperInputAmount;
        private inputAmount;
        private btnApprove;
        private btnStake;
        private btnUnstake;
        private btnMax;
        private txStatusModal;
        private approvalModelAction;
        onRefresh: () => void;
        constructor(parent?: Container, options?: ControlElement);
        set state(value: State);
        get state(): State;
        setData: (data: any) => void;
        getBalance: () => BigNumber;
        needToBeApproval: () => boolean;
        get actionKey(): string;
        private showMessage;
        private onApproveToken;
        private onStake;
        private onUnstake;
        private onInputAmount;
        private setMaxBalance;
        private renderStakingInfo;
        private onSetupPage;
        private updateEnableInput;
        private callback;
        initApprovalModelAction(): Promise<void>;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-staking/index.css.ts" />
declare module "@scom/scom-staking/index.css.ts" {
    export const stakingDappContainer: string;
    export const stakingComponent: string;
}
/// <amd-module name="@scom/scom-staking/formSchema.json.ts" />
declare module "@scom/scom-staking/formSchema.json.ts" {
    import { LockTokenType } from "@scom/scom-staking/global/index.ts";
    const _default_2: {
        general: {
            dataSchema: {
                type: string;
                properties: {
                    chainId: {
                        type: string;
                        enum: number[];
                        required: boolean;
                    };
                    customName: {
                        type: string;
                        label: string;
                        required: boolean;
                    };
                    customDesc: {
                        type: string;
                        label: string;
                    };
                    customLogo: {
                        type: string;
                        title: string;
                    };
                    getTokenURL: {
                        type: string;
                        title: string;
                    };
                    showContractLink: {
                        type: string;
                    };
                    stakings: {
                        type: string;
                        properties: {
                            address: {
                                type: string;
                                required: boolean;
                            };
                            lockTokenType: {
                                type: string;
                                oneOf: {
                                    title: string;
                                    const: LockTokenType;
                                }[];
                                required: boolean;
                            };
                            rewards: {
                                type: string;
                                properties: {
                                    address: {
                                        type: string;
                                        required: boolean;
                                    };
                                    isCommonStartDate: {
                                        type: string;
                                        title: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        theme: {
            dataSchema: {
                type: string;
                properties: {
                    dark: {
                        type: string;
                        properties: {
                            backgroundColor: {
                                type: string;
                                format: string;
                            };
                            fontColor: {
                                type: string;
                                format: string;
                            };
                            textSecondary: {
                                type: string;
                                title: string;
                                format: string;
                            };
                            inputBackgroundColor: {
                                type: string;
                                format: string;
                            };
                            inputFontColor: {
                                type: string;
                                format: string;
                            };
                            secondaryColor: {
                                type: string;
                                title: string;
                                format: string;
                            };
                            secondaryFontColor: {
                                type: string;
                                title: string;
                                format: string;
                            };
                        };
                    };
                    light: {
                        type: string;
                        properties: {
                            backgroundColor: {
                                type: string;
                                format: string;
                            };
                            fontColor: {
                                type: string;
                                format: string;
                            };
                            textSecondary: {
                                type: string;
                                title: string;
                                format: string;
                            };
                            inputBackgroundColor: {
                                type: string;
                                format: string;
                            };
                            inputFontColor: {
                                type: string;
                                format: string;
                            };
                            secondaryColor: {
                                type: string;
                                title: string;
                                format: string;
                            };
                            secondaryFontColor: {
                                type: string;
                                title: string;
                                format: string;
                            };
                        };
                    };
                };
            };
        };
    };
    export default _default_2;
}
/// <amd-module name="@scom/scom-staking" />
declare module "@scom/scom-staking" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { ISingleStakingCampaign } from "@scom/scom-staking/global/index.ts";
    import { IWalletPlugin } from '@scom/scom-wallet-modal';
    import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
    import { INetworkConfig } from '@scom/scom-network-picker';
    interface ScomStakingElement extends ControlElement {
        data?: ISingleStakingCampaign;
        lazyLoad?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-staking']: ScomStakingElement;
            }
        }
    }
    export default class ScomStaking extends Module {
        private state;
        private _data;
        tag: any;
        defaultEdit: boolean;
        private $eventBus;
        private loadingElm;
        private campaigns;
        private stakingElm;
        private noCampaignSection;
        private txStatusModal;
        private manageStakeElm;
        private listAprTimer;
        private listActiveTimer;
        private tokenMap;
        private dappContainer;
        private mdWallet;
        private rpcWalletEvents;
        private clientEvents;
        private _getActions;
        getConfigurators(): ({
            name: string;
            target: string;
            getActions: (category?: string) => any[];
            getData: any;
            setData: (data: any) => Promise<void>;
            getTag: any;
            setTag: any;
            elementName?: undefined;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
            bindOnChanged?: undefined;
        } | {
            name: string;
            target: string;
            elementName: string;
            getLinkParams: () => {
                data: string;
            };
            setLinkParams: (params: any) => Promise<void>;
            bindOnChanged: (element: ScomCommissionFeeSetup, callback: (data: any) => Promise<void>) => void;
            getData: () => {
                fee: string;
                then<TResult1 = ISingleStakingCampaign, TResult2 = never>(onfulfilled?: (value: ISingleStakingCampaign) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2>;
                catch<TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<ISingleStakingCampaign | TResult>;
                [Symbol.toStringTag]: string;
            };
            setData: any;
            getTag: any;
            setTag: any;
            getActions?: undefined;
        })[];
        private getData;
        private resetRpcWallet;
        private setData;
        private getTag;
        private updateTag;
        private setTag;
        private updateStyle;
        private updateTheme;
        get defaultChainId(): number;
        set defaultChainId(value: number);
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get showHeader(): boolean;
        set showHeader(value: boolean);
        private get chainId();
        private get rpcWallet();
        constructor(parent?: Container, options?: ControlElement);
        removeRpcWalletEvents(): void;
        onHide(): void;
        private registerEvent;
        private onChainChanged;
        private isWalletValid;
        private refreshUI;
        private initializeWidgetConfig;
        private initWallet;
        private showMessage;
        private onClaim;
        private checkValidation;
        private removeTimer;
        private getRewardToken;
        private getLPToken;
        init(): Promise<void>;
        private updateButtonStatus;
        private connectWallet;
        private initEmptyUI;
        private renderEmpty;
        private renderCampaigns;
        render(): any;
    }
}
