import { BigNumber, IClientSideProvider } from "@ijstech/eth-wallet";

export interface ICommissionInfo {
  chainId: number;
  walletAddress: string;
  share: string;
}

export enum CurrentMode {
  STAKE,
  UNLOCK
}

export enum LockTokenType {
  ERC20_Token,
  LP_Token,
  VAULT_Token
}

export interface ISingleStakingCampaign {
  chainId: number,
  name: string,
  desc?: string,
  logo?: string,
  getTokenURL?: string,
  // campaignStart: number, // new campaign
  // campaignEnd: number, // new campaign
  showContractLink?: boolean,
  // admin: string, // new campaign
  staking: ISingleStaking,
  stakeInputValue?: string,
  commissions?: ICommissionInfo[],
  wallets: IWalletPlugin[],
  networks: INetworkConfig[],
  showHeader?: boolean
}

export interface ISingleStaking {
  address: string,
  // lockTokenAddress: string, // new campaign
  // minLockTime: number, // new campaign
  // minLockTimeUnit: number, // new campaign
  // perAddressCap: number, // new campaign
  // maxTotalLock: number, // new campaign

  //custom
  desc?: string,
  lockTokenType: LockTokenType,
  rewards: ISingleReward
}

export interface ISingleReward {
  address: string,
  // rewardTokenAddress: string, // new campaign
  // multiplier: number, // new campaign
  // initialReward: number, // new campaign
  // vestingPeriod: number, // new campaign
  // vestingPeriodUnit: number, // new campaign
  // claimDeadline: number, // new campaign
  // admin: string, // new campaign
  isCommonStartDate?: boolean,
  // vestingStartDate?: number, // new campaign
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
      }
    };
    vaultToken: {
      object: {
        address: string;
        decimals: string;
        name: string;
        symbol: string;
        token0: string;
        token1: string;
      }
    };
  }
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

// Multiple Stakings
export interface IStakingCampaign {
  //custom
  chainId: number,
  name: string,
  desc?: string,
  logo?: string,
  getTokenURL?: string,
  campaignStart: BigNumber, //unix
  campaignEnd: BigNumber, //unix
  showContractLink?: boolean,
  admin: string, // can only withdraw remaining fund after claimDeadline.
  stakings: Staking[]
}

export interface RewardNeeded {
  value: BigNumber,
  tokenAddress: string,
}

export interface Staking {
  //contract
  address?: string,
  lockTokenAddress: string,
  minLockTime: BigNumber, //in second 
  perAddressCap: BigNumber,
  maxTotalLock: BigNumber,

  //custom
  desc?: string,
  lockTokenType: LockTokenType,
  decimalsOffset?: number,
  // totalRewardAmount?: RewardNeeded[], // total reward needed

  rewards: Reward[]
}

export interface Reward {
  //contract
  address?: string,
  rewardTokenAddress: string,
  multiplier: BigNumber, //lockAmount * multiplier = rewardAmount
  rewardAmount?: BigNumber, // reward needed
  initialReward: BigNumber, // 0 <= initialReward <= 1; lockAmount * initialReward = initialRewardAmount;
  vestingPeriod: BigNumber, // in second
  claimDeadline: BigNumber, //unix
  admin: string, // can only withdraw remaining fund after claimDeadline.
  isCommonStartDate?: boolean,
  vestingStartDate?: BigNumber //unix
}
