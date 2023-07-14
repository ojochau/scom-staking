import { Module, customModule, Container, VStack, application } from '@ijstech/components';
import { getMulticallInfoList } from '@scom/scom-multicall';
import { INetwork } from '@ijstech/eth-wallet';
import getNetworkList from '@scom/scom-network-list';
import ScomStaking from '@scom/scom-staking';

@customModule
export default class Module1 extends Module {
    private stakingElm: ScomStaking;
    private mainStack: VStack;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        const multicalls = getMulticallInfoList();
        const networkMap = this.getNetworkMap(options.infuraId);
        application.store = {
            infuraId: options.infuraId,
            multicalls,
            networkMap
        }
    }

    private getNetworkMap = (infuraId?: string) => {
        const networkMap = {};
        const defaultNetworkList: INetwork[] = getNetworkList();
        const defaultNetworkMap: Record<number, INetwork> = defaultNetworkList.reduce((acc, cur) => {
            acc[cur.chainId] = cur;
            return acc;
        }, {});
        for (const chainId in defaultNetworkMap) {
            const networkInfo = defaultNetworkMap[chainId];
            const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
            if (infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
                for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
                    networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{INFURA_ID}/g, infuraId);
                }
            }
            networkMap[networkInfo.chainId] = {
                ...networkInfo,
                symbol: networkInfo.nativeCurrency?.symbol || "",
                explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
                explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : ""
            }
        }
        return networkMap;
    }

    async init() {
        super.init();
    }

    render() {
        return <i-panel>
            <i-hstack id="mainStack" margin={{ top: '1rem', left: '1rem' }} gap="2rem">
                <i-scom-staking data={{
                    "chainId": 43113,
                    "customName": "Scom-Staking",
                    "customDesc": "Earn USDT.e",
                    "showContractLink": true,
                    "stakings":
                    {
                        "address": "0x0314297AdfE7012b9c6Cc0FDaB0c0a7C6E89285A",
                        "lockTokenType": 0,
                        "rewards":
                        {
                            "address": "0x35DE68B1eD3Edc32Bf41A53A3e7c37c17E50ce03",
                            "isCommonStartDate": false,
                        }
                    },
                    "networks": [
                        {
                            "chainId": 43113
                        },
                        {
                            "chainId": 97
                        }
                    ],
                    "wallets": [
                        {
                            "name": "metamask"
                        }
                    ],
                    defaultChainId: 43113
                }} />
            </i-hstack>
        </i-panel>
    }
}