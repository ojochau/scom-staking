/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dapp-container/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-token-input/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-token-input/@scom/scom-token-modal/@ijstech/eth-wallet/index.d.ts" />
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
    import { BigNumber } from "@ijstech/eth-wallet";
    export const DefaultDateFormat = "DD/MM/YYYY";
    export const formatDate: (date: any, customType?: string, showTimezone?: boolean) => string;
    export const formatNumber: (value: number | string | BigNumber, decimalFigures?: number) => string;
    export const isInvalidInput: (val: any) => boolean;
    export const limitInputNumber: (input: any, decimals?: number) => void;
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
    export enum CurrentMode {
        STAKE = 0,
        UNLOCK = 1
    }
    export enum LockTokenType {
        ERC20_Token = 0,
        LP_Token = 1,
        VAULT_Token = 2
    }
    export interface ISingleStakingCampaign {
        chainId: number;
        name: string;
        desc?: string;
        logo?: string;
        getTokenURL?: string;
        showContractLink?: boolean;
        staking: ISingleStaking;
        stakeInputValue?: string;
        commissions?: ICommissionInfo[];
        wallets: IWalletPlugin[];
        networks: INetworkConfig[];
        showHeader?: boolean;
    }
    export interface ISingleStaking {
        address: string;
        desc?: string;
        lockTokenType: LockTokenType;
        rewards: ISingleReward;
    }
    export interface ISingleReward {
        address: string;
        isCommonStartDate?: boolean;
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
    export interface IOptionInfo {
        mode: string;
        minLockTime: number;
        maxTotalLock: string;
        totalLocked: string;
        stakeQty: string;
        startOfEntryPeriod: number;
        endOfEntryPeriod: number;
        perAddressCap: string;
        lockTokenAddress: string;
        tokenAddress: string;
        rewardsData?: IRewardInfo[];
    }
    export interface IExtendOptionInfo extends IOptionInfo, ISingleStaking {
        tokenInfo?: {
            tokenAddress: string;
            lpToken: {
                object: {
                    address: string;
                    decimals: string;
                    name: string;
                    symbol: string;
                    token0: string;
                    token1: string;
                };
            };
            vaultToken: {
                object: {
                    address: string;
                    decimals: string;
                    name: string;
                    symbol: string;
                    token0: string;
                    token1: string;
                };
            };
        };
    }
    export interface ICampaignDetail extends ISingleStakingCampaign {
        option: IExtendOptionInfo;
        tokenAddress?: string;
    }
    export interface IRewardInfo extends ISingleReward {
        claimable: string;
        rewardTokenAddress: string;
        multiplier: string;
        initialReward: string;
        admin: string;
        vestingPeriod: number;
        vestingStartDate: number;
        rewardAmount: string;
        index: number;
        vestedReward?: number | string;
        claimStartTime?: number;
    }
    export interface IStakingCampaign {
        chainId: number;
        name: string;
        desc?: string;
        logo?: string;
        getTokenURL?: string;
        campaignStart: BigNumber;
        campaignEnd: BigNumber;
        showContractLink?: boolean;
        admin: string;
        stakings: Staking[];
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
        desc?: string;
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
    import { CurrentMode } from "@scom/scom-staking/global/index.ts";
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
            [key: string]: boolean;
        };
        proxyAddresses: ProxyAddresses;
        embedderCommissionFee: string;
        rpcWalletId: string;
        approvalModel: ERC20ApprovalModel;
        constructor(options: any);
        initRpcWallet(chainId: number): string;
        private initData;
        private setNetworkList;
        getProxyAddress(chainId?: number): string;
        setStakingStatus(key: CurrentMode, value: boolean): void;
        getStakingStatus(key: CurrentMode): boolean;
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
    export const tokenSymbol: (chainId: number, address: string) => string;
    export const getLockedTokenObject: (info: any, tokenInfo: any, tokenMap: any) => any;
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
        defaultBuilderData: {
            chainId: number;
            name: string;
            desc: string;
            showContractLink: boolean;
            staking: {
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
    import { ISingleStakingCampaign, ISingleStaking, IExtendOptionInfo } from "@scom/scom-staking/global/index.ts";
    import { State } from "@scom/scom-staking/store/index.ts";
    import { ITokenObject } from '@scom/scom-token-list';
    export const getTokenPrice: (wallet: IWallet, token: string) => Promise<string>;
    const getCampaignInfo: (wallet: IWallet, stakingInfo: {
        [key: number]: ISingleStakingCampaign;
    }) => Promise<{
        campaignStart: number;
        campaignEnd: number;
        tokenAddress: string;
        option: IExtendOptionInfo;
        chainId: number;
        name: string;
        desc?: string;
        logo?: string;
        getTokenURL?: string;
        showContractLink?: boolean;
        staking: ISingleStaking;
        stakeInputValue?: string;
        commissions?: import("@scom/scom-staking/global/index.ts").ICommissionInfo[];
        wallets: import("@scom/scom-staking/global/index.ts").IWalletPlugin[];
        networks: import("@scom/scom-staking/global/index.ts").INetworkConfig[];
        showHeader?: boolean;
    }>;
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
    const getProxySelectors: (state: State, chainId: number, contractAddress: string) => Promise<string[]>;
    export { getCampaignInfo, getStakingTotalLocked, getLPObject, getLPBalance, getVaultObject, getVaultBalance, getERC20RewardCurrentAPR, getLPRewardCurrentAPR, getVaultRewardCurrentAPR, withdrawToken, claimToken, lockToken, getProxySelectors };
}
/// <amd-module name="@scom/scom-staking/manage-stake/index.css.ts" />
declare module "@scom/scom-staking/manage-stake/index.css.ts" {
    export const stakingManageStakeStyle: string;
}
/// <amd-module name="@scom/scom-staking/manage-stake/index.tsx" />
declare module "@scom/scom-staking/manage-stake/index.tsx" {
    import { Button, Input, Container, ControlElement, Module } from '@ijstech/components';
    import { BigNumber } from '@ijstech/eth-wallet';
    import { IExtendOptionInfo } from "@scom/scom-staking/global/index.ts";
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
        inputAmount: Input;
        btnStake: Button;
        btnUnstake: Button;
        private btnApprove;
        private btnMax;
        private txStatusModal;
        private approvalModelAction;
        onRefresh: () => void;
        constructor(parent?: Container, options?: ControlElement);
        set state(value: State);
        get state(): State;
        setData: (data: IExtendOptionInfo) => Promise<void>;
        setInputValue: (value: string) => void;
        getBalance: () => BigNumber;
        needToBeApproval: () => boolean;
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
/// <amd-module name="@scom/scom-staking/formSchema.ts" />
declare module "@scom/scom-staking/formSchema.ts" {
    import ScomNetworkPicker from '@scom/scom-network-picker';
    import { LockTokenType } from "@scom/scom-staking/global/index.ts";
    const _default_2: {
        dataSchema: {
            type: string;
            properties: {
                chainId: {
                    type: string;
                    enum: number[];
                    required: boolean;
                };
                name: {
                    type: string;
                    label: string;
                    required: boolean;
                };
                desc: {
                    type: string;
                    label: string;
                };
                logo: {
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
                staking: {
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
        uiSchema: {
            type: string;
            elements: ({
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        scope: string;
                    }[];
                }[];
            } | {
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        label: string;
                        scope: string;
                    }[];
                }[];
            })[];
        };
        customControls: {
            "#/properties/chainId": {
                render: () => ScomNetworkPicker;
                getData: (control: ScomNetworkPicker) => number;
                setData: (control: ScomNetworkPicker, value: number) => void;
            };
        };
    };
    export default _default_2;
    export function getProjectOwnerSchema(): {
        dataSchema: {
            type: string;
            properties: {
                name: {
                    type: string;
                    label: string;
                    required: boolean;
                };
                desc: {
                    type: string;
                    label: string;
                };
                logo: {
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
                staking: {
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
        uiSchema: {
            type: string;
            elements: {
                type: string;
                scope: string;
            }[];
        };
    };
}
/// <amd-module name="@scom/scom-staking/flow/initialSetup.tsx" />
declare module "@scom/scom-staking/flow/initialSetup.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface ScomStakingFlowInitialSetupElement extends ControlElement {
        data?: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-staking-flow-initial-setup']: ScomStakingFlowInitialSetupElement;
            }
        }
    }
    export default class ScomStakingFlowInitialSetup extends Module {
        private state;
        private tokenRequirements;
        private executionProperties;
        private invokerId;
        private tokenInput;
        private $eventBus;
        private walletEvents;
        private mdWallet;
        private lbConnectedStatus;
        private btnConnectWallet;
        constructor(parent?: Container, options?: ControlElement);
        private get rpcWallet();
        private resetRpcWallet;
        setData(value: any): Promise<void>;
        private initWallet;
        private initializeWidgetConfig;
        private handleClickStart;
        connectWallet(): Promise<void>;
        private displayWalletStatus;
        private registerEvents;
        onHide(): void;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-staking" />
declare module "@scom/scom-staking" {
    import { Module, Container, ControlElement, Control } from '@ijstech/components';
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
        private loadingElm;
        private campaign;
        private stakingElm;
        private noCampaignSection;
        private txStatusModal;
        private manageStake;
        private listAprTimer;
        private activeTimer;
        private tokenMap;
        private dappContainer;
        private mdWallet;
        private rpcWalletEvents;
        private _getActions;
        private getProjectOwnerActions;
        getConfigurators(): ({
            name: string;
            target: string;
            getProxySelectors: (chainId: number) => Promise<string[]>;
            getActions: () => any[];
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
            getActions: (category?: string) => any[];
            getData: any;
            setData: (data: any) => Promise<void>;
            getTag: any;
            setTag: any;
            getProxySelectors?: undefined;
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
            getProxySelectors?: undefined;
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
        private connectWallet;
        private initEmptyUI;
        private renderEmpty;
        private renderCampaign;
        render(): any;
        handleFlowStage(target: Control, stage: string, options: any): Promise<{
            widget: any;
        }>;
    }
}
