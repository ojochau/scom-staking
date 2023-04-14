import { BigNumber } from "@ijstech/eth-contract";

export interface ICommissionInfo {
  chainId: number;
  walletAddress: string;
  share: string;
}

export enum LockTokenType {
  ERC20_Token,
  LP_Token,
  VAULT_Token
}

export interface ISingleStakingCampaign {
  chainId: number,
  customName: string,
  customDesc?: string,
  customLogo?: string,
  getTokenURL?: string,
  // campaignStart: number, // new campaign
  // campaignEnd: number, // new campaign
  showContractLink?: boolean,
  // admin: string, // new campaign
  stakings: ISingleStaking,
  commissions?: ICommissionInfo[]
}

export interface ISingleStaking {
  address: string,
  // lockTokenAddress: string, // new campaign
  // minLockTime: number, // new campaign
  // minLockTimeUnit: number, // new campaign
  // perAddressCap: number, // new campaign
  // maxTotalLock: number, // new campaign

  //custom
  customDesc?: string,
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

export interface IStakingCampaign {
  //custom
  chainId: number,
  customName: string,
  customDesc?: string,
  customLogo?: string,
  getTokenURL?: string,
  campaignStart: BigNumber, //unix
  campaignEnd: BigNumber, //unix
  showContractLink?: boolean,
  admin: string, // can only withdraw remaining fund after claimDeadline.
  stakings: Staking[],
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
  customDesc?: string,
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

export interface IEmbedData {
  chainId?: number,
  customName?: string,
  customDesc?: string,
  customLogo?: string,
  getTokenURL?: string,
  showContractLink?: boolean,
  stakings?: ISingleStaking,
  commissions?: ICommissionInfo[]
}