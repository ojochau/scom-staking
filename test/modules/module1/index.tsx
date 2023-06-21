import { Module, customModule, Container, VStack } from '@ijstech/components';
import ScomStaking from '@scom/scom-staking';

@customModule
export default class Module1 extends Module {
    private stakingElm: ScomStaking;
    private mainStack: VStack;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
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
                    "customDesc": "Earn OSWAP",
                    "showContractLink": true,
                    "stakings":
                    {
                        "address": "0x03C22D12eb6E5ea3a06F46Fc0e1857438BB7DCae",
                        "lockTokenType": 0,
                        "rewards":
                        {
                            "address": "0x10B846B7A1807B3610ee94c1b120D9c5E87C148d",
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