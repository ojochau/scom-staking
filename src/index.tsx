import { moment, Module, Panel, Icon, Button, Label, VStack, HStack, Container, ControlElement, application, customModule, customElements, Styles, Control } from '@ijstech/components';
import { BigNumber, Constants, IEventBusRegistry, Wallet } from '@ijstech/eth-wallet';
import Assets from './assets';
import {
	formatNumber,
	formatDate,
	registerSendTxEvents,
	TokenMapType,
	ISingleStakingCampaign,
	LockTokenType,
	ICampaignDetail,
	CurrentMode
} from './global/index';
import {
	tokenSymbol,
	fallBackUrl,
	getLockedTokenObject,
	getLockedTokenSymbol,
	getLockedTokenIconPaths,
	getTokenUrl,
	maxHeight,
	maxWidth,
	viewOnExplorerByAddress,
	State,
	isClientWalletConnected
} from './store/index';
import { tokenStore, assets as tokenAssets, ITokenObject } from '@scom/scom-token-list';
import configData from './data.json';

import {
	getStakingTotalLocked,
	getLPObject,
	getVaultObject,
	getERC20RewardCurrentAPR,
	getLPRewardCurrentAPR,
	getVaultRewardCurrentAPR,
	claimToken,
	getCampaignInfo,
	getProxySelectors,
} from './staking-utils/index';
import ManageStake from './manage-stake/index';
import { stakingComponent, stakingDappContainer } from './index.css';
import ScomDappContainer from '@scom/scom-dapp-container';
import ScomWalletModal, { IWalletPlugin } from '@scom/scom-wallet-modal';
import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
import ScomTxStatusModal from '@scom/scom-tx-status-modal';
import { INetworkConfig } from '@scom/scom-network-picker';
import formSchema, { getProjectOwnerSchema } from './formSchema';
import ScomStakingFlowInitialSetup from './flow/initialSetup';
import { BlockNoteSpecs, callbackFnType, executeFnType, BlockNoteEditor, Block, parseUrl, getWidgetEmbedUrl } from '@scom/scom-blocknote-sdk';
import { commonJson, mainJson, mergeI18nData } from './languages/index';

const Theme = Styles.Theme.ThemeVars;
const letterSpacing = '0.15px';

interface ScomStakingElement extends ControlElement {
	data?: ISingleStakingCampaign;
	lazyLoad?: boolean;
}

declare global {
	namespace JSX {
		interface IntrinsicElements {
			['i-scom-staking']: ScomStakingElement;
		}
	}
}

@customModule
@customElements('i-scom-staking')
export default class ScomStaking extends Module implements BlockNoteSpecs {
	private state: State;
	private _data: ISingleStakingCampaign;
	tag: any = {};
	defaultEdit: boolean = true;

	private loadingElm: Panel;
	private campaign: ICampaignDetail;
	private stakingElm: Panel;
	private noCampaignSection: Panel;
	private txStatusModal: ScomTxStatusModal;
	private manageStake: ManageStake;
	private listAprTimer: any = [];
	private activeTimer: any;
	private tokenMap: TokenMapType = {};
	private dappContainer: ScomDappContainer;
	private mdWallet: ScomWalletModal;

	private rpcWalletEvents: IEventBusRegistry[] = [];

	addBlock(blocknote: any, executeFn: executeFnType, callbackFn?: callbackFnType) {
		const moduleData = {
			name: '@scom/scom-staking',
			localPath: 'scom-staking'
		}

		const blockType = 'staking';

		const stakingRegex = /https:\/\/widget.noto.fan\/(#!\/)?scom\/scom-staking\/\S+/g;
		function getData(href: string) {
			const widgetData = parseUrl(href);
			if (widgetData) {
				const { module, properties } = widgetData;
				if (module.localPath === moduleData.localPath) return { ...properties };
			}
			return false;
		}

		const StakingBlock = blocknote.createBlockSpec(
			{
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
			},
			{
				render: (block: Block) => {
					const wrapper = new Panel();
					const props = JSON.parse(JSON.stringify(block.props));
					const customElm = new ScomStaking(wrapper, { ...props });
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
							getAttrs: (element: string | HTMLElement) => {
								if (typeof element === "string") {
									return false;
								}
								const href = element.getAttribute('href');
								if (href) return getData(href);
								return false;
							},
							priority: 408,
							node: blockType
						},
						{
							tag: "p",
							getAttrs: (element: string | HTMLElement) => {
								if (typeof element === "string") {
									return false;
								}
								const child = element.firstChild as HTMLElement;
								if (child?.nodeName === 'A' && child.getAttribute('href')) {
									const href = child.getAttribute('href');
									return getData(href);
								}
								return false;
							},
							priority: 409,
							node: blockType
						}
					]
				},
				toExternalHTML: (block: any, editor: any) => {
					const link = document.createElement("a");
					const url = getWidgetEmbedUrl(
						{
							type: blockType,
							props: { ...(block.props || {}) }
						},
						moduleData
					);
					link.setAttribute("href", url);
					link.textContent = blockType;
					const wrapper = document.createElement("p");
					wrapper.appendChild(link);
					return { dom: wrapper };
				},
				pasteRules: [
					{
						find: stakingRegex,
						handler(props: any) {
							const { state, chain, range } = props;
							const textContent = state.doc.resolve(range.from).nodeAfter?.textContent;
							const widgetData = parseUrl(textContent);
							if (!widgetData) return null;
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
			}
		);
		const StakingSlashItem = {
			name: "Staking",
			execute: (editor: BlockNoteEditor) => {
				const block: any = {
					type: blockType,
					props: configData.defaultBuilderData
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
		}
	}

	private _getActions(category?: string) {
		const actions = [];
		if (category !== 'offers') {
			actions.push(
				{
					name: 'Edit',
					icon: 'edit',
					command: (builder: any, userInputData: any) => {
						let oldData: ISingleStakingCampaign = {
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
								const {
									chainId,
									name,
									desc,
									logo,
									getTokenURL,
									showContractLink,
									staking,
									...themeSettings
								} = userInputData;

								const generalSettings = {
									chainId,
									name,
									desc,
									logo,
									getTokenURL,
									showContractLink,
									staking
								};
								if (generalSettings.chainId !== undefined) this._data.chainId = generalSettings.chainId;
								if (generalSettings.name !== undefined) this._data.name = generalSettings.name;
								if (generalSettings.desc !== undefined) this._data.desc = generalSettings.desc;
								if (generalSettings.logo !== undefined) this._data.logo = generalSettings.logo;
								if (generalSettings.getTokenURL !== undefined) this._data.getTokenURL = generalSettings.getTokenURL;
								if (generalSettings.showContractLink !== undefined) this._data.showContractLink = generalSettings.showContractLink;
								if (generalSettings.staking !== undefined) this._data.staking = generalSettings.staking;
								await this.resetRpcWallet();
								this.refreshUI();
								if (builder?.setData) builder.setData(this._data);

								oldTag = JSON.parse(JSON.stringify(this.tag));
								if (builder) builder.setTag(themeSettings);
								else this.setTag(themeSettings);
								if (this.dappContainer) this.dappContainer.setTag(themeSettings);
							},
							undo: async () => {
								this._data = JSON.parse(JSON.stringify(oldData));
								this.refreshUI();
								if (builder?.setData) builder.setData(this._data);

								this.tag = JSON.parse(JSON.stringify(oldTag));
								if (builder) builder.setTag(this.tag);
								else this.setTag(this.tag);
								if (this.dappContainer) this.dappContainer.setTag(userInputData);
							},
							redo: () => { }
						}
					},
					userInputDataSchema: formSchema.dataSchema,
					userInputUISchema: formSchema.uiSchema,
					customControls: formSchema.customControls
				}
			);
		}
		return actions;
	}

	private getProjectOwnerActions() {
		const formSchema = getProjectOwnerSchema();
		const actions: any[] = [
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
				getProxySelectors: async (chainId: number) => {
					const address = this.campaign?.option?.[0]?.address;
					const selectors = await getProxySelectors(this.state, chainId, address);
					return selectors;
				},
				getActions: () => {
					return this.getProjectOwnerActions();
				},
				getData: this.getData.bind(this),
				setData: async (data: any) => {
					await this.setData(data);
				},
				getTag: this.getTag.bind(this),
				setTag: this.setTag.bind(this)
			},
			{
				name: 'Builder Configurator',
				target: 'Builders',
				getActions: (category?: string) => {
					return this._getActions(category);
				},
				getData: this.getData.bind(this),
				setData: async (data: any) => {
					const defaultData = configData.defaultBuilderData;
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
					}
				},
				setLinkParams: async (params: any) => {
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
				bindOnChanged: (element: ScomCommissionFeeSetup, callback: (data: any) => Promise<void>) => {
					element.onChanged = async (data: any) => {
						let resultingData = {
							...self._data,
							...data
						};
						await this.setData(resultingData);
						await callback(data);
					}
				},
				getData: () => {
					const fee = this.state.embedderCommissionFee;
					return { ...this.getData(), fee }
				},
				setData: this.setData.bind(this),
				getTag: this.getTag.bind(this),
				setTag: this.setTag.bind(this)
			},
			{
				name: 'Editor',
				target: 'Editor',
				getActions: (category?: string) => {
					const actions = this._getActions(category);
					const editAction = actions.find(action => action.name === 'Edit');
					return editAction ? [editAction] : [];
				},
				getData: this.getData.bind(this),
				setData: this.setData.bind(this),
				getTag: this.getTag.bind(this),
				setTag: this.setTag.bind(this)
			}
		]
	}

	private async getData() {
		return this._data;
	}

	private async resetRpcWallet() {
		this.removeRpcWalletEvents();
		const rpcWalletId = await this.state.initRpcWallet(this.chainId);
		const rpcWallet = this.rpcWallet;
		const chainChangedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.ChainChanged, async (chainId: number) => {
			this.onChainChanged();
		});
		const connectedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
			this.initializeWidgetConfig();
		});
		this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);

		const data = {
			defaultChainId: this.chainId,
			wallets: this.wallets,
			networks: this.networks.length ? this.networks : [{ chainId: this.chainId }],
			showHeader: this.showHeader,
			rpcWalletId: rpcWallet.instanceId
		}
		if (this.dappContainer?.setData) this.dappContainer.setData(data);
		// TODO - update proxy address
	}

	private async setData(value: any) {
		this._data = value;
		await this.resetRpcWallet();
		this.initializeWidgetConfig();
	}

	private async getTag() {
		return this.tag;
	}

	private updateTag(type: 'light' | 'dark', value: any) {
		this.tag[type] = this.tag[type] ?? {};
		for (let prop in value) {
			if (value.hasOwnProperty(prop))
				this.tag[type][prop] = value[prop];
		}
	}

	private async setTag(value: any) {
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

	private updateStyle(name: string, value: any) {
		value ?
			this.style.setProperty(name, value) :
			this.style.removeProperty(name);
	}

	private updateTheme() {
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

	set wallets(value: IWalletPlugin[]) {
		this._data.wallets = value;
	}

	get networks() {
		return this._data.networks ?? [];
	}

	set networks(value: INetworkConfig[]) {
		this._data.networks = value;
	}

	get showHeader() {
		return this._data.showHeader ?? true;
	}

	set showHeader(value: boolean) {
		this._data.showHeader = value;
	}

	private get chainId() {
		return this._data.chainId;
	}

	private get rpcWallet() {
		return this.state.getRpcWallet();
	}

	constructor(parent?: Container, options?: ControlElement) {
		super(parent, options);
		this.state = new State(configData);
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

	private onChainChanged = async () => {
		this.initializeWidgetConfig();
	}

	private refreshUI = () => {
		this.initializeWidgetConfig();
	}

	private initializeWidgetConfig = (hideLoading?: boolean) => {
		setTimeout(async () => {
			if (!hideLoading && this.loadingElm) {
				this.loadingElm.visible = true;
			}
			if (!isClientWalletConnected() || !this._data || !this.checkValidation()) {
				await this.renderEmpty();
				return;
			}
			await this.initWallet();
			tokenStore.updateTokenMapData(this.chainId);
			await tokenStore.updateTokenBalancesByChainId(this.chainId);
			this.campaign = await getCampaignInfo(this.rpcWallet, { [this._data.chainId]: this._data });
			await this.renderCampaign(hideLoading);
			if (!hideLoading && this.loadingElm) {
				this.loadingElm.visible = false;
			}
		})
	}

	private initWallet = async () => {
		try {
			await Wallet.getClientInstance().init();
			const rpcWallet = this.rpcWallet;
			await rpcWallet.init();
		} catch (err) {
			console.log(err);
		}
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

	private onClaim = async (btnClaim: Button, data: any) => {
		this.showMessage('warning', this.i18n.get('$claim', { token: data.rewardSymbol }));
		const callBack = async (err: any, reply: any) => {
			if (err) {
				this.showMessage('error', err);
			} else {
				this.showMessage('success', reply);
				btnClaim.enabled = false;
				btnClaim.rightIcon.visible = true;
			}
		};

		const confirmationCallBack = async (receipt: any) => {
			this.initializeWidgetConfig(true);
			if (!btnClaim) return;
			btnClaim.rightIcon.visible = false;
			btnClaim.enabled = true;
		};

		registerSendTxEvents({
			transactionHash: callBack,
			confirmation: confirmationCallBack
		});

		claimToken(data.reward.address, callBack);
	}

	private checkValidation = () => {
		if (!this._data) return false;
		const { chainId, name, staking } = this._data;
		if (!chainId || !name || !staking) return false;
		const { address, rewards, lockTokenType } = staking;
		if (!address || !rewards || !rewards.address || lockTokenType === undefined) return false;
		// const { chainId, customName, campaignStart, campaignEnd, admin, staking } = this._data;
		// if (!chainId || !customName || !campaignStart?.gt(0) || !campaignEnd?.gt(0) || !admin || !staking) return false;
		// const { lockTokenAddress, minLockTime, perAddressCap, maxTotalLock, rewards } = staking;
		// if (!lockTokenAddress || !minLockTime?.gt(0) || !perAddressCap?.gt(0) || !maxTotalLock?.gt(0) || !rewards) return false;
		// const { rewardTokenAddress, multiplier, initialReward, vestingPeriod, claimDeadline } = rewards[0];
		// if (!rewardTokenAddress || !multiplier?.gt(0) || initialReward?.isNaN() || !vestingPeriod?.gt(0) || !claimDeadline) return false;
		return true;
	}

	private removeTimer = () => {
		for (const timer of this.listAprTimer) {
			clearInterval(timer);
		}
		this.listAprTimer = [];
		clearInterval(this.activeTimer);
	}

	private getRewardToken = (tokenAddress: string) => {
		return this.tokenMap[tokenAddress] || this.tokenMap[tokenAddress?.toLocaleLowerCase()] || {} as ITokenObject;
	}

	private getLPToken = (campaign: any, token: string, chainId?: number) => {
		if (campaign.getTokenURL) {
			window.open(campaign.getTokenURL);
		} else {
			window.open(getTokenUrl ? getTokenUrl : `https:openswap.xyz/#/swap?chainId=${chainId}&fromToken=BNB&toToken=${token}&fromAmount=1&showOptimizedRoutes=false`);
		}
	}

	async init() {
		this.i18n.init({ ...mergeI18nData([commonJson, mainJson]) });
		await super.init();
		const lazyLoad = this.getAttribute('lazyLoad', true, false);
		if (!lazyLoad) {
			const data = this.getAttribute('data', true);
			if (data) {
				await this.setData(data);
			} else {
				this.renderEmpty();
			}
		}
		this.executeReadyCallback();
	}

	private connectWallet = async () => {
		if (!isClientWalletConnected()) {
			if (this.mdWallet) {
				await application.loadPackage('@scom/scom-wallet-modal', '*');
				this.mdWallet.networks = this.networks;
				this.mdWallet.wallets = this.wallets;
				this.mdWallet.showModal();
			}
			return;
		}
		if (!this.state.isRpcWalletConnected()) {
			const clientWallet = Wallet.getClientInstance();
			await clientWallet.switchNetwork(this.chainId);
		}
	}

	private initEmptyUI = async () => {
		if (!this.noCampaignSection) {
			this.noCampaignSection = await Panel.create({ height: '100%' });
		}
		const isClientConnected = isClientWalletConnected();
		// const isRpcConnected = this.state.isRpcWalletConnected();
		this.noCampaignSection.clearInnerHTML();
		this.noCampaignSection.appendChild(
			<i-vstack
				height="100%"
				background={{ color: Theme.background.main }}
				padding={{ top: '3rem', bottom: '3rem', left: '2rem', right: '2rem' }}
				justifyContent='center'
				class="no-campaign text-center"
			>
				<i-vstack verticalAlignment="center" gap="1rem" width="100%" height="100%">
					<i-image width="100%" height="100%" url={Assets.fullPath('img/staking/TrollTrooper.svg')} />
					<i-label caption={this.i18n.get(isClientConnected ? '$no_campaigns' : '$please_connect_with_your_wallet')} font={{ size: '1.5rem' }} letterSpacing={letterSpacing} />
					{
						// !isClientConnected || !isRpcConnected ? <i-button
						// caption={this.i18n.get(!isClientConnected ? '$connect_wallet' : '$switch_network')}
						// class="btn-os btn-stake"
						// maxWidth={220}
						// // background={{ color: `${Theme.colors.primary.main} !important` }}
						// font={{ size: '14px', /*color: Theme.colors.primary.contrastText*/ }}
						// margin={{ left: 'auto', right: 'auto', bottom: 0 }}
						// onClick={this.connectWallet} /> : []
					}
				</i-vstack>
			</i-vstack>
		);
		this.noCampaignSection.visible = true;
	}

	private renderEmpty = async () => {
		await this.initEmptyUI();
		if (this.stakingElm) {
			this.stakingElm.clearInnerHTML();
			this.stakingElm.appendChild(this.noCampaignSection);
		}
		if (this.loadingElm) {
			this.loadingElm.visible = false;
		}
	}

	private renderCampaign = async (hideLoading?: boolean) => {
		if (!hideLoading) {
			this.stakingElm.clearInnerHTML();
		}
		this.tokenMap = tokenStore.getTokenMapByChainId(this.chainId);
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
		const containerSection = await Panel.create();
		// containerSection.classList.add('container');
		let opt = { ...campaign.option };
		let lpTokenData: any = {};
		let vaultTokenData: any = {};
		if (opt.tokenAddress) {
			if (opt.lockTokenType == LockTokenType.LP_Token) {
				lpTokenData = {
					'object': await getLPObject(rpcWallet, opt.tokenAddress)
				}
			} else if (opt.lockTokenType == LockTokenType.VAULT_Token) {
				vaultTokenData = {
					'object': await getVaultObject(rpcWallet, opt.tokenAddress)
				}
			}
		}
		const tokenInfo = {
			tokenAddress: campaign.tokenAddress,
			lpToken: lpTokenData,
			vaultToken: vaultTokenData
		}
		opt = {
			...opt,
			tokenInfo
		}
		const stakingInfo = opt;
		const lockedTokenObject = getLockedTokenObject(stakingInfo, stakingInfo.tokenInfo, this.tokenMap);
		const lockedTokenSymbol = getLockedTokenSymbol(stakingInfo, lockedTokenObject);
		const lockedTokenIconPaths = getLockedTokenIconPaths(stakingInfo, lockedTokenObject, chainId, this.tokenMap);
		const lockedTokenDecimals = lockedTokenObject?.decimals || 18;
		const defaultDecimalsOffset = 18 - lockedTokenDecimals;
		const activeStartTime = stakingInfo ? stakingInfo.startOfEntryPeriod : 0;
		const activeEndTime = stakingInfo ? stakingInfo.endOfEntryPeriod : 0;
		let isStarted = moment(activeStartTime).diff(moment()) <= 0;
		let isClosed = moment(activeEndTime).diff(moment()) <= 0;
		let totalLocked: any = {};
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
		const stakingElm = await VStack.create();
		const activeTimerRow = await VStack.create({ gap: 2, width: '25%', verticalAlignment: 'center' });
		const activeTimerElm = await VStack.create();
		activeTimerRow.appendChild(<i-label caption="$end_date" font={{ size: '0.875rem' }} opacity={0.5} letterSpacing={letterSpacing} />);
		activeTimerRow.appendChild(activeTimerElm);
		const endHour = await Label.create(optionTimer);
		const endDay = await Label.create(optionTimer);
		const endMin = await Label.create(optionTimer);
		activeTimerElm.appendChild(
			<i-hstack gap={4}>
				{endDay}
				<i-label caption="D" lineHeight={'1.25rem'} font={{ size: '0.875rem' }} letterSpacing={letterSpacing} />
				{endHour}
				<i-label caption="H" lineHeight={'1.25rem'} font={{ size: '0.875rem' }} letterSpacing={letterSpacing} />
				{endMin}
				<i-label caption="M" lineHeight={'1.25rem'} font={{ size: '0.875rem' }} letterSpacing={letterSpacing} />
			</i-hstack>
		);

		// Sticker
		const stickerSection = await VStack.create({
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
		const stickerLabel = await Label.create({
			display: 'flex',
			font: { size: '0.75rem', color: '#3f3f42' },
			grid: { horizontalAlignment: 'center' },
			letterSpacing
		});
		const stickerIcon = await Icon.create({
			fill: '#fff',
			width: 14,
			height: 14,
			display: 'block',
			margin: { left: 'auto', right: 'auto' }
		});
		stickerSection.classList.add('sticker');
		stickerSection.appendChild(
			<i-vstack
				position='absolute'
				top='0.75rem'
				right='-1.6rem'
				width={50}
				lineHeight={'1rem'}
			>
				{stickerIcon}
				{stickerLabel}
			</i-vstack>
		);

		const setAvailableQty = async () => {
			if (!this.state.isRpcWalletConnected() || !this.manageStake) return;
			const o = opt;
			const _totalLocked = await getStakingTotalLocked(rpcWallet, o.address);
			totalLocked[o.address] = _totalLocked;
			const optionQty = new BigNumber(o.maxTotalLock).minus(_totalLocked).shiftedBy(defaultDecimalsOffset);
			if (o.mode === 'Stake') {
				const btnStake = this.manageStake.btnStake;
				const isStaking = this.state.getStakingStatus(CurrentMode.STAKE);
				if (btnStake) {
					let isValidInput = false;
					const inputElm = this.manageStake.inputAmount;
					if (inputElm) {
						const inputVal = new BigNumber(inputElm.value || 0);
						isValidInput = inputVal.gt(0) && inputVal.lte(this.manageStake.getBalance()) && !this.manageStake.needToBeApproval();
					}
					btnStake.enabled = !isStaking && isValidInput && (isStarted && !(optionQty.lte(0) || isClosed));
				}
			} else {
				const btnUnstake = this.manageStake.btnUnstake;
				const isUnstaking = this.state.getStakingStatus(CurrentMode.UNLOCK);
				if (btnUnstake) {
					btnUnstake.enabled = !isUnstaking && o.mode !== 'Stake' && Number(o.stakeQty) != 0 && !this.manageStake.needToBeApproval();
				}
			}
			if (isClosed) {
				if (stickerLabel.caption !== this.i18n.get('$close')) {
					stickerSection.border.bottom = { width: '50px', style: 'solid', color: '#0c1234' }
					stickerIcon.fill = '#f7d064';
					stickerLabel.font = { size: '0.75rem', color: '#f7d064' };
					stickerLabel.caption = this.i18n.get('$close');
					stickerIcon.name = 'check-square';
				}
			} else if (optionQty.lte(0)) {
				if (stickerLabel.caption !== this.i18n.get('$sold_out')) {
					stickerLabel.caption = this.i18n.get('$sold_out');
					stickerIcon.name = 'star';
					stickerSection.border.bottom = { width: '50px', style: 'solid', color: '#ccc' }
					stickerIcon.fill = '#fff';
					stickerLabel.font = { size: '0.75rem', color: '#3f3f42' };
				}
			} else {
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
			isStarted = moment(activeStartTime).diff(moment()) <= 0;
			isClosed = moment(activeEndTime).diff(moment()) <= 0;
			activeTimerRow.visible = isStarted && !isClosed;
			if (activeEndTime == 0) {
				endDay.caption = endHour.caption = endMin.caption = '0';
				if (this.activeTimer) {
					clearInterval(this.activeTimer);
				}
			} else {
				const days = moment(activeEndTime).diff(moment(), 'days');
				const hours = moment(activeEndTime).diff(moment(), 'hours') - days * 24;
				const mins = moment(activeEndTime).diff(moment(), 'minutes') - days * 24 * 60 - hours * 60;
				endDay.caption = `${days}`;
				endHour.caption = `${hours}`;
				endMin.caption = `${mins}`;
			}
		}

		const setTimer = () => {
			setEndRemainingTime();
			setAvailableQty();
		}
		setTimer();

		const option = { ...opt };
		this.manageStake = new ManageStake(undefined, {
			width: '100%',
		});
		this.manageStake.state = this.state;
		this.manageStake.onRefresh = () => this.initializeWidgetConfig(true);

		const isClaim = option.mode === 'Claim';

		const rewardsData = option.rewardsData && option.rewardsData[0] ? [option.rewardsData[0]] : [];
		const rewardOptions = !isClaim ? rewardsData : [];
		let aprInfo: any = {};

		const claimStakedRow = await HStack.create({ verticalAlignment: 'center', horizontalAlignment: 'space-between' });
		claimStakedRow.appendChild(<i-label caption="$you_staked" font={{ size: '1rem' }} letterSpacing={letterSpacing} />);
		claimStakedRow.appendChild(<i-label caption={`${formatNumber(new BigNumber(option.stakeQty).shiftedBy(defaultDecimalsOffset))} ${lockedTokenSymbol}`} font={{ size: '1rem' }} letterSpacing={letterSpacing} />);

		const rowRewards = await VStack.create({ gap: 8, verticalAlignment: 'center' });
		for (let idx = 0; idx < rewardsData.length; idx++) {
			const reward = rewardsData[idx];
			const rewardToken = this.getRewardToken(reward.rewardTokenAddress);
			const rewardTokenDecimals = rewardToken.decimals || 18;
			let decimalsOffset = 18 - rewardTokenDecimals;
			let rewardLockedDecimalsOffset = decimalsOffset;
			if (rewardTokenDecimals !== 18 && lockedTokenDecimals !== 18) {
				rewardLockedDecimalsOffset = decimalsOffset * 2;
			} else if (lockedTokenDecimals !== 18 && rewardTokenDecimals === 18) {
				rewardLockedDecimalsOffset = rewardTokenDecimals - lockedTokenDecimals;
				decimalsOffset = 18 - lockedTokenDecimals;
			}
			const rewardSymbol = rewardToken.symbol || '';
			rowRewards.appendChild(
				<i-hstack horizontalAlignment="space-between">
					<i-label caption={this.i18n.get('$token_locked', { token: rewardSymbol })} font={{ size: '1rem', color: Theme.text.primary }} letterSpacing={letterSpacing} />
					<i-label caption={`${formatNumber(new BigNumber(reward.vestedReward || 0).shiftedBy(rewardLockedDecimalsOffset))} ${rewardSymbol}`} font={{ size: '1rem' }} letterSpacing={letterSpacing} />
				</i-hstack>
			);
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
			const passClaimStartTime = !(reward.claimStartTime && moment().diff(moment.unix(reward.claimStartTime)) < 0);
			let rewardClaimable = `0 ${rewardSymbol}`;
			if (passClaimStartTime && isClaim) {
				rewardClaimable = `${formatNumber(new BigNumber(reward.claimable).shiftedBy(decimalsOffset))} ${rewardSymbol}`;
			}
			let startClaimingText = '';
			if (!(!reward.claimStartTime || passClaimStartTime) && isClaim) {
				const claimStart = moment.unix(reward.claimStartTime).format('YYYY-MM-DD HH:mm:ss');
				startClaimingText = this.i18n.get('$claim_token_after_start', { token: rewardSymbol, start: claimStart });
			}
			rowRewards.appendChild(
				<i-hstack horizontalAlignment="space-between">
					<i-label caption={this.i18n.get('$token_claimable', { token: rewardSymbol })} font={{ size: '1rem' }} letterSpacing={letterSpacing} />
					<i-label caption={rewardClaimable} font={{ size: '1rem' }} />
					{startClaimingText ? <i-label caption={startClaimingText} font={{ size: '1rem' }} letterSpacing={letterSpacing} /> : []}
				</i-hstack>
			);

			const btnClaim = await Button.create({
				rightIcon: {
					spin: true,
					fill: '#fff',
					visible: false,
					margin: { left: '0.25rem', right: '0.25rem' },
					width: 16, height: 16
				},
				caption: rpcWalletConnected ? this.i18n.get('$claim_token', { token: rewardSymbol }) : this.i18n.get('$switch_network'),
				font: { size: '1rem', bold: true },
				enabled: !rpcWalletConnected || (rpcWalletConnected && !(!passClaimStartTime || new BigNumber(reward.claimable).isZero()) && isClaim),
				margin: { left: 'auto', right: 'auto', bottom: 10 },
				padding: { top: '0.625rem', bottom: '0.625rem' },
				border: { radius: 12 },
				maxWidth: '100%',
				width: 370,
				height: 'auto'
			})
			btnClaim.classList.add('btn-os');
			btnClaim.onClick = () => rpcWalletConnected ? this.onClaim(btnClaim, { reward, rewardSymbol }) : this.connectWallet();
			rowRewards.appendChild(btnClaim);
		};

		const getAprValue = (rewardOption: any) => {
			if (rewardOption && aprInfo && aprInfo[rewardOption.rewardTokenAddress]) {
				const apr = new BigNumber(aprInfo[rewardOption.rewardTokenAddress]).times(100).toFormat(2, BigNumber.ROUND_DOWN);
				return `${apr}%`;
			}
			return '';
		}

		const durationDays = option.minLockTime / (60 * 60 * 24);
		const _lockedTokenObject = getLockedTokenObject(option, option.tokenInfo, this.tokenMap);
		const _lockedTokenIconPaths = getLockedTokenIconPaths(option, _lockedTokenObject, chainId, this.tokenMap);
		const pathsLength = _lockedTokenIconPaths.length;
		const rewardToken = rewardsData?.length ? this.getRewardToken(rewardsData[0].rewardTokenAddress) : null;
		stakingElm.appendChild(
			<i-vstack gap={15} width={maxWidth} height="100%" padding={{ top: 10, bottom: 10, left: 20, right: 20 }} position="relative">
				{stickerSection}
				<i-hstack gap={10} width="100%" verticalAlignment="center">
					<i-hstack gap={10} width="50%">
						<i-hstack width={pathsLength === 1 ? 63.5 : 80} position="relative" verticalAlignment="center">
							<i-image width={60} height={60} url={tokenAssets.tokenPath(rewardToken, chainId)} fallbackUrl={fallBackUrl} />
							{
								_lockedTokenIconPaths.map((v: string, idxImg: number) => {
									return <i-image position="absolute" width={28} height={28} bottom={0} left={(idxImg * 20) + 35} url={tokenAssets.fullPath(v)} fallbackUrl={fallBackUrl} />
								})
							}
						</i-hstack>
						<i-vstack gap={2} overflow={{ x: 'hidden' }} verticalAlignment="center">
							<i-label visible={!!campaign.name} caption={campaign.name} font={{ size: '1.25rem', color: Theme.text.secondary, bold: true }} textOverflow="ellipsis" letterSpacing={letterSpacing} class="text-overflow" />
							<i-label visible={!!campaign.desc} caption={campaign.desc} font={{ size: '1rem' }} opacity={0.5} textOverflow="ellipsis" letterSpacing={letterSpacing} class="text-overflow" />
						</i-vstack>
					</i-hstack>
					{
						await Promise.all(rewardOptions.map(async (rewardOption: any, idx: number) => {
							const lbApr = await Label.create({ font: { size: '2rem', color: Theme.text.secondary }, letterSpacing });
							const lbRate = await Label.create({ font: { size: '1rem' }, opacity: 0.5, letterSpacing });
							lbApr.classList.add('text-overflow');
							const rewardToken = this.getRewardToken(rewardOption.rewardTokenAddress);
							const rewardTokenDecimals = rewardToken.decimals || 18;
							const decimalsOffset = 18 - rewardTokenDecimals;
							const lockTokenType = option.lockTokenType;

							// const rateDesc = `1 ${lockTokenType === LockTokenType.LP_Token ? 'LP' : tokenSymbol(option.lockTokenAddress)} : ${new BigNumber(rewardOption.multiplier).shiftedBy(decimalsOffset).toFixed()} ${tokenSymbol(rewardOption.rewardTokenAddress)}`;
							const rateDesc = `1 ${lockTokenType === LockTokenType.LP_Token ? 'LP' : tokenSymbol(this.chainId, option.lockTokenAddress)} : ${rewardOption.multiplier} ${tokenSymbol(this.chainId, rewardOption.rewardTokenAddress)}`;
							const updateApr = async () => {
								if (lockTokenType === LockTokenType.ERC20_Token) {
									const apr: any = await getERC20RewardCurrentAPR(rpcWallet, rewardOption, lockedTokenObject, durationDays);
									if (!isNaN(parseFloat(apr))) {
										aprInfo[rewardOption.rewardTokenAddress] = apr;
									}
								} else if (lockTokenType === LockTokenType.LP_Token) {
									if (rewardOption.referencePair) {
										aprInfo[rewardOption.rewardTokenAddress] = await getLPRewardCurrentAPR(rpcWallet, rewardOption, option.tokenInfo?.lpToken?.object, durationDays);
									}
								} else {
									aprInfo[rewardOption.rewardTokenAddress] = await getVaultRewardCurrentAPR(rpcWallet, rewardOption, option.tokenInfo?.vaultToken?.object, durationDays);
								}
								const aprValue = getAprValue(rewardOption);
								lbApr.caption = `APR ${aprValue}`;
								lbRate.caption = rateDesc;
							}
							updateApr();
							this.listAprTimer.push(setInterval(updateApr, 10000));
							const aprValue = getAprValue(rewardOption);
							lbApr.caption = `APR ${aprValue}`;
							lbRate.caption = rateDesc;
							return <i-vstack verticalAlignment="center">
								{lbApr}
								{lbRate}
							</i-vstack>
						}))
					}
				</i-hstack>
				<i-hstack width="100%" verticalAlignment="center">
					<i-vstack gap={2} width="25%" verticalAlignment="center">
						<i-label caption="$start_date" font={{ size: '0.875rem' }} opacity={0.5} letterSpacing={letterSpacing} />
						<i-label caption={formatDate(option.startOfEntryPeriod, 'DD MMM, YYYY')} font={{ size: '1rem' }} letterSpacing={letterSpacing} />
					</i-vstack>
					{activeTimerRow}
					<i-vstack gap={2} width="25%" verticalAlignment="center">
						<i-label caption="$stake_duration" font={{ size: '0.875rem' }} opacity={0.5} letterSpacing={letterSpacing} />
						<i-hstack gap={4} verticalAlignment="center">
							<i-button
								height="auto"
								caption={durationDays < 1 ? this.i18n.get('$less_than_one_day') : this.i18n.get('$duration_days', { duration: durationDays.toString() })}
								font={{ size: '12px', color: Theme.colors.secondary.contrastText, weight: 700 }}
								background={{ color: `${Theme.colors.secondary.main} !important` }}
								border={{ radius: 12, width: 1, style: 'solid', color: 'transparent' }}
								padding={{ top: 2.5, bottom: 2.5, left: 8, right: 8 }}
								cursor="default"
								class="btn-os cursor-default"
							/>
						</i-hstack>
					</i-vstack>
					<i-vstack gap={4} width="25%" margin={{ left: 'auto' }} verticalAlignment="center" horizontalAlignment="end">
						<i-hstack gap={4} class="pointer" width="fit-content" verticalAlignment="center" onClick={() => this.getLPToken(campaign, lockedTokenSymbol, chainId)}>
							<i-icon name="external-link-alt" width={12} height={12} fill={Theme.text.primary} />
							<i-label caption={this.i18n.get('$get_token', { token: lockedTokenSymbol })} font={{ size: '0.85rem' }} letterSpacing={letterSpacing} />
							{
								lockedTokenIconPaths.map((v: any) => {
									return <i-image display="flex" width={15} height={15} url={tokenAssets.fullPath(v)} fallbackUrl={fallBackUrl} />
								})
							}
						</i-hstack >
						{
							campaign.showContractLink ?
								<i-hstack gap={4} class="pointer" width="fit-content" verticalAlignment="center" onClick={() => viewOnExplorerByAddress(chainId, option.address)}>
									<i-icon name="external-link-alt" width={12} height={12} fill={Theme.text.primary} class="inline-block" />
									<i-label caption="$view_contract" font={{ size: '0.85rem' }} letterSpacing={letterSpacing} />
								</i-hstack> : []
						}
						{/* {
										campaign.showContractLink && isClaim ?
										<i-hstack gap={4} class="pointer" width="fit-content" verticalAlignment="center" onClick={() => viewOnExplorerByAddress(chainId, rewardsData[0].address)}>
											<i-icon name="external-link-alt" width={12} height={12} fill={colorText} class="inline-block" />
											<i-label caption="$view_reward_contract" font={{ size: '13.6px', color: colorText }} />
										</i-hstack> : []
									} */}
					</i-vstack>
				</i-hstack>
				<i-vstack gap={8}>
					{claimStakedRow}
					{/* {
									await Promise.all(rewardOptions.map(async (rewardOption: any, idx: number) => {
										const rewardToken = this.getRewardToken(rewardOption.rewardTokenAddress);
										const rewardTokenDecimals = rewardToken.decimals || 18;
										const decimalsOffset = 18 - rewardTokenDecimals;
										let offset = decimalsOffset;
										if (rewardTokenDecimals !== 18 && lockedTokenDecimals !== 18) {
											offset = offset * 2;
										} else if (lockedTokenDecimals !== 18 && rewardTokenDecimals === 18) {
											offset = 18 - lockedTokenDecimals;
										}
										const earnedQty = formatNumber(new BigNumber(option.totalCredit).times(new BigNumber(rewardOption.multiplier)).shiftedBy(offset));
										const earnedSymbol = this.getRewardToken(rewardOption.rewardTokenAddress).symbol || '';
										const rewardElm = await HStack.create({ verticalAlignment: 'center', horizontalAlignment: 'space-between' });
										rewardElm.appendChild(<i-label caption="$you_earned" font={{ size: '16px', color: colorText }} />);
										rewardElm.appendChild(<i-label caption={`${earnedQty} ${earnedSymbol}`} font={{ size: '16px', color: colorText }} />);
										return rewardElm;
									}))
								} */}
					<i-vstack verticalAlignment="center" horizontalAlignment="center">
						{this.manageStake}
					</i-vstack>
					{rowRewards}
				</i-vstack>
			</i-vstack>
		);

		await this.manageStake.setData({
			...campaign,
			...option
		});

		if (this._data.stakeInputValue) {
			this.manageStake.setInputValue(this._data.stakeInputValue);
		}
		containerSection.appendChild(
			<i-hstack background={{ color: Theme.background.main }} width="100%" height={maxHeight} border={{ width: 1, style: 'solid', color: '#7979794a' }}>
				{stakingElm}
			</i-hstack >
		)
		this.stakingElm.clearInnerHTML();
		this.stakingElm.append(this.noCampaignSection, containerSection);
	}

	render() {
		return (
			<i-scom-dapp-container id="dappContainer" class={stakingDappContainer}>
				<i-panel class={stakingComponent} minHeight={200}>
					<i-panel
						id="stakingLayout"
						width={maxWidth}
						height={maxHeight}
						maxWidth="100%"
						margin={{ left: 'auto', right: 'auto' }}
						overflow={'hidden'}
					>
						<i-vstack id="loadingElm" background={{ color: Theme.background.main }} class="i-loading-overlay">
							<i-vstack class="i-loading-spinner" horizontalAlignment="center" verticalAlignment="center">
								<i-icon
									class="i-loading-spinner_icon"
									image={{ url: Assets.fullPath('img/loading.svg'), width: 36, height: 36 }}
								/>
								<i-label
									caption="Loading..." font={{ color: '#FD4A4C', size: '1.5em' }}
									letterSpacing={letterSpacing}
									class="i-loading-spinner_text"
								/>
							</i-vstack>
						</i-vstack>
						<i-panel
							id="stakingElm"
							background={{ color: Theme.background.main }}
							width="100%" height="100%"
							maxWidth={maxWidth} maxHeight={maxHeight}
							class="wrapper"
						/>
					</i-panel>
					<i-scom-wallet-modal id="mdWallet" wallets={[]} />
					<i-scom-tx-status-modal id="txStatusModal" />
				</i-panel>
			</i-scom-dapp-container>
		)
	}

	async handleFlowStage(target: Control, stage: string, options: any) {
		let widget;
		if (stage === 'initialSetup') {
			widget = new ScomStakingFlowInitialSetup();
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
		}
	}
}
