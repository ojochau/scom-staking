import { moment, Button, Input, Container, HStack, customElements, ControlElement, Module, Label, Styles, application } from '@ijstech/components';
import { BigNumber, IERC20ApprovalAction, TransactionReceipt } from '@ijstech/eth-wallet';
import { CurrentMode, IExtendOptionInfo, LockTokenType, TokenMapType, limitInputNumber } from '../global/index';
import { getLockedTokenObject, getLockedTokenSymbol, getChainNativeToken, isClientWalletConnected, State } from '../store/index';
import { ITokenObject, tokenStore } from '@scom/scom-token-list';
import ScomTxStatusModal from '@scom/scom-tx-status-modal';
import {
  lockToken,
  withdrawToken,
  getLPObject,
  getLPBalance,
  getVaultObject,
  getVaultBalance,
  getStakingTotalLocked,
  parseDepositEvent,
} from '../staking-utils/index';
import { stakingManageStakeStyle } from './index.css';

const Theme = Styles.Theme.ThemeVars;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['staking-manage-stake']: ControlElement;
    }
  }
};

@customElements('staking-manage-stake')
export default class ManageStake extends Module {
  private _state: State;
  private stakingInfo: IExtendOptionInfo;
  private address: string;
  private lockedTokenObject = {} as ITokenObject;
  private maxQty = 0;
  private availableQty = '0';
  private balance = '0';
  private perAddressCap = '0';
  private stakeQty = '0';
  private tokenSymbol = '';
  private currentMode = CurrentMode.STAKE;
  private tokenBalances: { [key: string]: string } = {};
  private tokenMap: TokenMapType = {};
  private lbToken: Label;
  private wrapperInputAmount: HStack;
  public inputAmount: Input;
  public btnStake: Button;
  public btnUnstake: Button;
  private btnApprove: Button;
  private btnMax: Button;
  private txStatusModal: ScomTxStatusModal;
  private approvalModelAction: IERC20ApprovalAction;
  public onRefresh: () => void;

  constructor(parent?: Container, options?: ControlElement) {
    super(parent, options);
  }

  set state(value: State) {
    this._state = value;
  }

  get state() {
    return this._state;
  }

  setData = async (data: IExtendOptionInfo) => {
    this.address = data.address;
    this.stakingInfo = data;
    await this.onSetupPage();
  }

  setInputValue = (value: string) => {
    this.inputAmount.value = value;
    this.onInputAmount();
  }

  getBalance = () => {
    return BigNumber.min(this.availableQty, this.balance, this.perAddressCap);
  }

  needToBeApproval = () => {
    return this.btnApprove && this.btnApprove.visible;
  }

  private showMessage = (status: 'warning' | 'success' | 'error', content?: string | Error) => {
    if (!this.txStatusModal) return;
    let params: any = { status };
    if (status === 'success') {
      params.txtHash = content;
    } else {
      params.content = content;
    }
    this.txStatusModal.message = { ...params };
    this.txStatusModal.showModal();
  }

  private onApproveToken = async () => {
    this.showMessage('warning', `Approve ${this.tokenSymbol}`);
    this.approvalModelAction.doApproveAction(this.lockedTokenObject, this.inputAmount.value);
  }

  private onStake = async () => {
    this.currentMode = CurrentMode.STAKE;
    this.approvalModelAction.doPayAction();
  }

  private onUnstake = () => {
    this.currentMode = CurrentMode.UNLOCK;
    this.approvalModelAction.doPayAction();
  }

  private onInputAmount = () => {
    if (this.inputAmount.enabled === false) return;
    this.currentMode = CurrentMode.STAKE;
    limitInputNumber(this.inputAmount, this.lockedTokenObject?.decimals || 18);
    if (this.state.isRpcWalletConnected())
      this.approvalModelAction.checkAllowance(this.lockedTokenObject, this.inputAmount.value);
  }

  private setMaxBalance = () => {
    this.currentMode = CurrentMode.STAKE;
    this.inputAmount.value = BigNumber.min(this.availableQty, this.balance, this.perAddressCap).toFixed();
    limitInputNumber(this.inputAmount, this.lockedTokenObject?.decimals || 18);
    if (this.state.isRpcWalletConnected())
      this.approvalModelAction.checkAllowance(this.lockedTokenObject, this.inputAmount.value);
  };

  private renderStakingInfo = async (info: IExtendOptionInfo) => {
    if (!info || !Object.keys(info).length) {
      this.btnApprove.visible = false;
      if (!this.state.isRpcWalletConnected()) {
        this.btnMax.visible = false;
        this.inputAmount.enabled = false;
      }
      return;
    };
    this.btnStake.id = `btn-stake-${this.address}`;
    this.btnUnstake.id = `btn-unstake-${this.address}`;
    let lpTokenData: any = {};
    let vaultTokenData: any = {};
    const rpcWallet = this.state.getRpcWallet();
    const { tokenAddress, lockTokenType, mode } = info;
    if (tokenAddress && mode === 'Stake') {
      if (lockTokenType == LockTokenType.LP_Token) {
        lpTokenData = {
          'object': await getLPObject(rpcWallet, tokenAddress),
          'balance': await getLPBalance(rpcWallet, tokenAddress)
        }
      } else if (lockTokenType == LockTokenType.VAULT_Token) {
        vaultTokenData = {
          'object': await getVaultObject(rpcWallet, tokenAddress),
          'balance': await getVaultBalance(rpcWallet, tokenAddress)
        }
      }
    }
    const tokenInfo = {
      tokenAddress: tokenAddress,
      lpToken: lpTokenData,
      vaultToken: vaultTokenData
    }
    this.lockedTokenObject = getLockedTokenObject(info, tokenInfo, this.tokenMap);
    const defaultDecimalsOffset = 18 - (this.lockedTokenObject?.decimals || 18);
    const symbol = getLockedTokenSymbol(info, this.lockedTokenObject);
    this.tokenSymbol = symbol;
    this.perAddressCap = new BigNumber(info.perAddressCap).shiftedBy(defaultDecimalsOffset).toFixed();
    this.maxQty = new BigNumber(info.maxTotalLock).shiftedBy(defaultDecimalsOffset).toNumber();
    this.stakeQty = new BigNumber(info.stakeQty).shiftedBy(defaultDecimalsOffset).toFixed();
    const totalLocked = new BigNumber(info.totalLocked).shiftedBy(defaultDecimalsOffset);
    this.availableQty = new BigNumber(this.maxQty).minus(totalLocked).toFixed();
    this.btnApprove.visible = false;
    // Unstake
    if ((CurrentMode as any)[mode.toUpperCase()] !== CurrentMode.STAKE) {
      if (this.state.isRpcWalletConnected()) {
        this.approvalModelAction.checkAllowance(this.lockedTokenObject, this.stakeQty);
      }
      this.btnStake.visible = false;
      this.wrapperInputAmount.visible = false;
      this.btnUnstake.visible = true;
    } else {
      this.btnStake.visible = true;
      this.wrapperInputAmount.visible = true;
      this.btnUnstake.visible = false;
    }
    // Stake
    if (tokenAddress && mode === 'Stake') {
      if (lockTokenType == LockTokenType.ERC20_Token) {
        let balances = tokenStore.getTokenBalancesByChainId(this.state.getChainId());
        this.tokenBalances = Object.keys(balances).reduce((accumulator: any, key) => {
          accumulator[key.toLowerCase()] = balances[key];
          return accumulator;
        }, {});
        this.balance = this.tokenBalances[tokenAddress] || '0';
      } else if (lockTokenType == LockTokenType.LP_Token) {
        this.balance = new BigNumber(lpTokenData.balance || 0).shiftedBy(defaultDecimalsOffset).toFixed();
      } else if (lockTokenType == LockTokenType.VAULT_Token) {
        this.balance = new BigNumber(vaultTokenData.balance || 0).shiftedBy(defaultDecimalsOffset).toFixed();
      }
      this.btnMax.visible = true;
      if (!this.lbToken.isConnected) await this.lbToken.ready();
      this.lbToken.caption = symbol;
    }
    await this.updateEnableInput();
    if (!this.state.isRpcWalletConnected()) {
      this.btnMax.enabled = false;
      this.inputAmount.enabled = false;
    }
  }

  private onSetupPage = async () => {
    if (!isClientWalletConnected()) {
      this.btnStake.enabled = false;
      this.btnUnstake.enabled = false;
      this.btnApprove.visible = false;
      this.inputAmount.enabled = false;
      this.renderStakingInfo(null);
      return;
    }
    this.btnUnstake.enabled = true;
    this.tokenMap = tokenStore.getTokenMapByChainId(this.state.getChainId());
    if (this.state.isRpcWalletConnected()) {
      await this.initApprovalModelAction();
    }
    await this.ready();
    await this.renderStakingInfo(this.stakingInfo);
  }

  private updateEnableInput = async () => {
    if (this.stakingInfo?.mode !== 'Stake') return;
    const totalLocked = await getStakingTotalLocked(this.state.getRpcWallet(), this.address);
    const activeStartTime = this.stakingInfo.startOfEntryPeriod;
    const activeEndTime = this.stakingInfo.endOfEntryPeriod;
    const lockedTokenDecimals = this.lockedTokenObject?.decimals || 18;
    const defaultDecimalsOffset = 18 - lockedTokenDecimals;
    const optionQty = new BigNumber(this.stakingInfo.maxTotalLock).minus(totalLocked).shiftedBy(defaultDecimalsOffset);
    const isStarted = moment(activeStartTime).diff(moment()) <= 0;
    const isClosed = moment(activeEndTime).diff(moment()) <= 0;
    const enabled = (isStarted && !(optionQty.lte(0) || isClosed));
    this.inputAmount.enabled = enabled;
    this.btnMax.enabled = enabled && new BigNumber(this.balance).gt(0);
  }

  private callback = (err: any) => {
    this.showMessage('error', err);
  }

  async initApprovalModelAction() {
    this.approvalModelAction = await this.state.setApprovalModelAction({
      sender: this,
      payAction: async () => {
        this.showMessage('warning', `${this.currentMode === CurrentMode.STAKE ? 'Stake' : 'Unlock'} ${this.tokenSymbol}`);
        if (this.currentMode === CurrentMode.STAKE) {
          lockToken(this.lockedTokenObject, this.inputAmount.value, this.address, this.callback);
        } else {
          withdrawToken(this.address, this.callback);
        }
      },
      onToBeApproved: async (token: ITokenObject) => {
        if (new BigNumber(this.inputAmount.value).lte(BigNumber.min(this.availableQty, this.balance, this.perAddressCap))) {
          this.btnApprove.caption = `Approve ${token.symbol}`;
          this.btnApprove.visible = true;
          this.btnApprove.enabled = true;
        } else {
          this.btnApprove.visible = false;
        }
        this.btnStake.enabled = false;
        this.btnUnstake.enabled = this.stakingInfo.mode !== 'Stake' && new BigNumber(this.stakeQty).gt(0);
      },
      onToBePaid: async (token: ITokenObject) => {
        this.btnApprove.visible = false;
        const isClosed = moment(this.stakingInfo?.endOfEntryPeriod || 0).diff(moment()) <= 0;
        if (this.currentMode === CurrentMode.STAKE) {
          const amount = new BigNumber(this.inputAmount.value);
          if (amount.gt(this.balance)) {
            this.btnStake.caption = 'Insufficient Balance';
            this.btnStake.enabled = false;
            return;
          }
          this.btnStake.caption = 'Stake';
          if (amount.isNaN() || amount.lte(0) || amount.gt(BigNumber.min(this.availableQty, this.balance, this.perAddressCap))) {
            this.btnStake.enabled = false;
          } else {
            this.btnStake.enabled = !isClosed;
          }
        }
        this.btnUnstake.enabled = this.stakingInfo.mode !== 'Stake' && new BigNumber(this.stakeQty).gt(0);
      },
      onApproving: async (token: ITokenObject, receipt?: string) => {
        if (receipt) {
          this.showMessage('success', receipt);
          this.btnApprove.caption = `Approving`;
          this.btnApprove.enabled = false;
          this.btnApprove.rightIcon.visible = true;
          this.btnMax.enabled = false;
          this.inputAmount.enabled = false;
        }
      },
      onApproved: async (token: ITokenObject) => {
        const rpcWallet = this.state.getRpcWallet();
        try {
          if (rpcWallet.address) {
            await tokenStore.updateTokenBalances(rpcWallet, [getChainNativeToken(this.state.getChainId())]);
          }
        } catch { }
        await this.updateEnableInput();
        this.btnApprove.rightIcon.visible = false;
        this.btnApprove.visible = false;
      },
      onApprovingError: async (token: ITokenObject, err: Error) => {
        this.showMessage('error', err);
        this.btnApprove.rightIcon.visible = false;
        this.btnMax.enabled = new BigNumber(this.balance).gt(0);
        this.inputAmount.enabled = true;
      },
      onPaying: async (receipt?: string) => {
        if (receipt) {
          this.showMessage('success', receipt);
          this.inputAmount.enabled = false;
          this.btnMax.enabled = false;
          if (this.currentMode === CurrentMode.STAKE) {
            this.btnStake.caption = 'Staking';
            this.btnStake.rightIcon.visible = true;
            this.state.setStakingStatus(this.currentMode, true);
            this.btnUnstake.enabled = false;
          } else {
            this.btnUnstake.caption = 'Unstaking';
            this.btnUnstake.rightIcon.visible = true;
            this.state.setStakingStatus(this.currentMode, true);
            this.btnStake.enabled = false;
          }
        }
      },
      onPaid: async (data?: any, receipt?: TransactionReceipt) => {
        if (this.onRefresh) {
          const rpcWallet = this.state.getRpcWallet();
          if (rpcWallet.address) {
            await tokenStore.updateAllTokenBalances(rpcWallet);
          }
          await this.onRefresh();
          this.state.setStakingStatus(this.currentMode, false);
        }
        if (this.currentMode === CurrentMode.STAKE) {
          this.btnStake.caption = 'Stake';
          this.btnStake.rightIcon.visible = false;
          if (this.state.handleAddTransactions) {
            let event = parseDepositEvent(this.state, receipt, this.address);
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
            this.state.handleAddTransactions({
              list: transactionsInfoArr
            });
          }
        } else {
          this.btnUnstake.caption = 'Unstake';
          this.btnUnstake.rightIcon.visible = false;
        }
        await this.updateEnableInput();
        this.inputAmount.value = '';
        this.btnStake.enabled = false;
        this.btnUnstake.enabled = this.stakingInfo.mode !== 'Stake' && new BigNumber(this.stakeQty).gt(0);
      },
      onPayingError: async (err: Error) => {
        await this.updateEnableInput();
        if (this.currentMode === CurrentMode.STAKE) {
          this.btnStake.caption = 'Stake';
          this.btnStake.rightIcon.visible = false;
        } else {
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
    return (
      <i-panel class={stakingManageStakeStyle}>
        <i-hstack gap={10} verticalAlignment="center" horizontalAlignment="center">
          <i-hstack id="wrapperInputAmount" gap={4} width={280} height={36} padding={{ right: 8 }} background={{ color: Theme.input.background }} border={{ radius: 8 }} verticalAlignment="center" horizontalAlignment="space-between">
            <i-input
              id="inputAmount"
              inputType="number"
              placeholder="0.0"
              width="100%"
              height="100%"
              border={{style: 'none'}}
              padding={{left: 8, right: 8}}
              font={{size: '1rem'}}
              onChanged={() => this.onInputAmount()}
            />
            <i-hstack gap={4} verticalAlignment="center">
              <i-button
                id="btnMax"
                caption="Max"
                enabled={false}
                // background={{ color: `${Theme.colors.primary.main} !important` }}
                // font={{ color: Theme.colors.primary.contrastText }}
                font={{ size: '1rem', color: '#fff', weight: 700 }}
                class="btn-os"
                width={45}
                minHeight={25}
                onClick={() => this.setMaxBalance()}
              />
              <i-label id="lbToken" font={{ size: '14px', color: Theme.input.fontColor }} opacity={0.5} />
            </i-hstack>
          </i-hstack>
          <i-hstack gap={10} width="calc(100% - 290px)">
            <i-button
              id="btnApprove"
              caption="Approve"
              enabled={false}
              visible={false}
              width="100%"
              minHeight={36}
              border={{ radius: 12 }}
              rightIcon={{ spin: true, visible: false, fill: '#fff' }}
              // rightIcon={{ spin: true, visible: false, fill: Theme.colors.primary.contrastText }}
              // background={{ color: `${Theme.colors.primary.main} !important` }}
              // font={{ color: Theme.colors.primary.contrastText }}
              font={{ size: '1rem', color: '#fff', weight: 700 }}
              class="btn-os"
              onClick={() => this.onApproveToken()}
            />
            <i-button
              id="btnStake"
              caption="Stake"
              enabled={false}
              width="100%"
              minHeight={36}
              border={{ radius: 12 }}
              rightIcon={{ spin: true, visible: false, fill: '#fff' }}
              // rightIcon={{ spin: true, visible: false, fill: Theme.colors.primary.contrastText }}
              // background={{ color: `${Theme.colors.primary.main} !important` }}
              // font={{ color: Theme.colors.primary.contrastText }}
              font={{ size: '1rem', color: '#fff', weight: 700 }}
              class="btn-os"
              onClick={() => this.onStake()}
            />
            <i-button
              id="btnUnstake"
              caption="Unstake"
              enabled={false}
              width="100%"
              minHeight={36}
              border={{ radius: 12 }}
              rightIcon={{ spin: true, visible: false, fill: '#fff' }}
              // rightIcon={{ spin: true, visible: false, fill: Theme.colors.primary.contrastText }}
              // background={{ color: `${Theme.colors.primary.main} !important` }}
              font={{ size: '1rem', color: '#fff', weight: 700 }}
              class="btn-os"
              onClick={() => this.onUnstake()}
            />
          </i-hstack>
        </i-hstack>
        <i-scom-tx-status-modal id="txStatusModal" />
      </i-panel>
    )
  }
}
