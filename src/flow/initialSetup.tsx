import {
    Module,
    ControlElement,
    customModule,
    customElements,
    Container,
    Styles,
    IEventBus,
    application,
    Label,
    Button
} from '@ijstech/components';
import { tokenStore } from '@scom/scom-token-list';
import { isClientWalletConnected, State } from '../store/index';
import ScomTokenInput from '@scom/scom-token-input';
import { BigNumber, Constants, IEventBusRegistry, Wallet } from '@ijstech/eth-wallet';
import ScomWalletModal from '@scom/scom-wallet-modal';

const Theme = Styles.Theme.ThemeVars;

interface ScomStakingFlowInitialSetupElement extends ControlElement {
    data?: any;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-staking-flow-initial-setup']: ScomStakingFlowInitialSetupElement;
        }
    }
}

@customModule
@customElements('i-scom-staking-flow-initial-setup')
export default class ScomStakingFlowInitialSetup extends Module {
    private _state: State;
    private tokenRequirements: any;
    private executionProperties: any;
    private tokenInput: ScomTokenInput;
    private walletEvents: IEventBusRegistry[] = [];
    private mdWallet: ScomWalletModal;
    private lbConnectedStatus: Label;
    private btnConnectWallet: Button;

    set state(value: State) {
        this._state = value;
    }
    
    get state() {
        return this._state;
    }

    private get rpcWallet() {
        return this.state.getRpcWallet();
    }
    private async resetRpcWallet() {
        const rpcWalletId = await this.state.initRpcWallet(this.executionProperties.chainId);
        const rpcWallet = this.rpcWallet;
    }
    async setData(value: any) {
        this.executionProperties = value.executionProperties;
        this.tokenRequirements = value.tokenRequirements;
        await this.resetRpcWallet();
        await this.initializeWidgetConfig();
    }
    private initWallet = async () => {
        try {
            const rpcWallet = this.rpcWallet;
            await rpcWallet.init();
        } catch (err) {
            console.log(err);
        }
    }
    private initializeWidgetConfig = async () => {
        let connected = isClientWalletConnected();
        this.displayWalletStatus(connected);
        await this.initWallet();
        tokenStore.updateTokenMapData(this.executionProperties.chainId);
        const rpcWallet = this.rpcWallet;
        // let campaigns = await getAllCampaignsInfo(rpcWallet, { [this._data.chainId]: this._data });
        // let campaignInfo = campaigns[0];
        // let tokenAddress = campaignInfo.tokenAddress?.toLowerCase()
        let tokenAddress = this.tokenRequirements[0].tokenOut.address?.toLowerCase();
        this.tokenInput.chainId = this.executionProperties.chainId;
        const tokenMap = tokenStore.getTokenMapByChainId(this.executionProperties.chainId);
        const token = tokenMap[tokenAddress];
        this.tokenInput.tokenDataListProp = [token];
        this.tokenInput.token = token
        await tokenStore.updateTokenBalances(rpcWallet, [token]);
    }
    private handleClickStart = async () => {
        this.tokenInput.readOnly = true;
        const tokenBalances = await tokenStore.getTokenBalancesByChainId(this.executionProperties.chainId);
        const balance = tokenBalances[this.tokenInput.token.address.toLowerCase()];
        this.tokenRequirements[0].tokenOut.amount = this.tokenInput.value;
        this.executionProperties.stakeInputValue = this.tokenInput.value;
        const isBalanceSufficient = new BigNumber(balance).gte(this.tokenInput.value);
        if (this.state.handleNextFlowStep) {
            this.state.handleNextFlowStep({
                isInitialSetup: true,
                amount: this.tokenInput.value,
                tokenAcquisition: !isBalanceSufficient,
                tokenRequirements: this.tokenRequirements,
                executionProperties: this.executionProperties
            });
        }
    }
    async connectWallet() {
        if (!isClientWalletConnected()) {
            if (this.mdWallet) {
                await application.loadPackage('@scom/scom-wallet-modal', '*');
                this.mdWallet.networks = this.executionProperties.networks;
                this.mdWallet.wallets = this.executionProperties.wallets;
                this.mdWallet.showModal();
            }
        }
    }
    private displayWalletStatus(connected: boolean) {
        if (connected) {
            this.lbConnectedStatus.caption = 'Connected with ' + Wallet.getClientInstance().address;
            this.btnConnectWallet.visible = false;
        }
        else {
            this.lbConnectedStatus.caption = 'Please connect your wallet first';
            this.btnConnectWallet.visible = true;
        }
    }
    private registerEvents() {
        let clientWallet = Wallet.getClientInstance();
        this.walletEvents.push(clientWallet.registerWalletEvent(this, Constants.ClientWalletEvent.AccountsChanged, async (payload: Record<string, any>) => {
            const { userTriggeredConnect, account } = payload;
            let connected = !!account;
            this.displayWalletStatus(connected);
        }));
    }
    onHide() {
        let clientWallet = Wallet.getClientInstance();
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
        return (
            <i-vstack gap='1rem' padding={{ top: 10, bottom: 10, left: 20, right: 20 }}>
                <i-label caption='Get Ready to Stake' font={{ size: '1.5rem' }}></i-label>

                <i-vstack gap='1rem'>
                    <i-label id="lbConnectedStatus"></i-label>
                    <i-hstack>
                        <i-button
                            id="btnConnectWallet"
                            caption='Connect Wallet'
                            font={{ color: Theme.colors.primary.contrastText }}
                            padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }}
                            onClick={this.connectWallet}
                        ></i-button>
                    </i-hstack>
                    <i-label caption='How many tokens are you planning to stake?'></i-label>
                    <i-hstack verticalAlignment='center' width='50%'>
                        <i-scom-token-input
                            id="tokenInput"
                            placeholder='0.0'
                            value='-'
                            tokenReadOnly={true}
                            isBalanceShown={false}
                            isBtnMaxShown={false}
                            border={{ radius: '1rem' }}
                            font={{ size: '1.25rem' }}
                            background={{ color: Theme.input.background }}
                        ></i-scom-token-input>
                    </i-hstack>
                    <i-hstack horizontalAlignment='center'>
                        <i-button
                            id="btnStart"
                            caption="Start"
                            padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }}
                            font={{ color: Theme.colors.primary.contrastText, size: '1.5rem' }}
                            onClick={this.handleClickStart}
                        ></i-button>
                    </i-hstack>
                </i-vstack>
                <i-scom-wallet-modal id="mdWallet" wallets={[]} />
            </i-vstack>
        )
    }
}