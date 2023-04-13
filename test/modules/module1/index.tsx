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
                    "campaignStart": 1667290500,
                    "campaignEnd": 1669883160,
                    "showContractLink": true,
                    "admin": "0xA81961100920df22CF98703155029822f2F7f033",
                    "stakings":
                    {
                        "address": "0x0A65a49932999bbCfaE21252a7cabEb3B264E03f",
                        "lockTokenAddress": "0xb9C31Ea1D475c25E58a1bE1a46221db55E5A7C6e",
                        "minLockTime": 1,
                        "minLockTimeUnit": 1,
                        "perAddressCap": 10,
                        "maxTotalLock": 10,
                        "customDesc": "",
                        "lockTokenType": 0,
                        "rewards":
                        {
                            "address": "0x6378005EB043d60485Bd2E490386acAAC36Dd9Dd",
                            "rewardTokenAddress": "0x78d9D80E67bC80A11efbf84B7c8A65Da51a8EF3C",
                            "multiplier": 0.2,
                            "initialReward": 0.1,
                            "vestingPeriod": 1,
                            "vestingPeriodUnit": 30,
                            "claimDeadline": 253402275599,
                            "admin": "",
                            "isCommonStartDate": false,
                            "vestingStartDate": 0
                        }
                    }
                }} />
            </i-hstack>
        </i-panel>
    }
}