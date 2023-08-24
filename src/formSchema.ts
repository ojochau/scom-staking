import ScomNetworkPicker from '@scom/scom-network-picker';
import { LockTokenType } from './global/index';

const chainIds = [1, 56, 137, 250, 97, 80001, 43113, 43114];

const theme = {
    backgroundColor: {
        type: 'string',
        format: 'color'
    },
    fontColor: {
        type: 'string',
        format: 'color'
    },
    textSecondary: {
        type: 'string',
        title: 'Campaign Font Color',
        format: 'color'
    },
    inputBackgroundColor: {
        type: 'string',
        format: 'color'
    },
    inputFontColor: {
        type: 'string',
        format: 'color'
    },
    // buttonBackgroundColor: {
    // 	type: 'string',
    // 	format: 'color'
    // },
    // buttonFontColor: {
    // 	type: 'string',
    // 	format: 'color'
    // },
    secondaryColor: {
        type: 'string',
        title: 'Timer Background Color',
        format: 'color'
    },
    secondaryFontColor: {
        type: 'string',
        title: 'Timer Font Color',
        format: 'color'
    }
}

export default {
    general: {
        dataSchema: {
            type: 'object',
            properties: {
                chainId: {
                    type: 'number',
                    enum: chainIds,
                    required: true
                },
                customName: {
                    type: 'string',
                    label: 'Campaign Name',
                    required: true
                },
                customDesc: {
                    type: 'string',
                    label: 'Campaign Description'
                },
                customLogo: {
                    type: 'string',
                    title: 'Campaign Logo'
                },
                getTokenURL: {
                    type: 'string',
                    title: 'Token Trade URL'
                },
                showContractLink: {
                    type: 'boolean'
                },
                stakings: {
                    type: 'object',
                    properties: {
                        address: {
                            type: 'string',
                            required: true
                        },
                        // customDesc: {
                        //   type: 'string',
                        //   title: 'Staking Description',
                        //   readOnly
                        // },
                        lockTokenType: {
                            type: 'number',
                            oneOf: [
                                { title: 'ERC20_Token', const: LockTokenType.ERC20_Token },
                                { title: 'LP_Token', const: LockTokenType.LP_Token },
                                { title: 'VAULT_Token', const: LockTokenType.VAULT_Token },
                            ],
                            required: true
                        },
                        rewards: {
                            type: 'object',
                            properties: {
                                address: {
                                    type: 'string',
                                    required: true
                                },
                                isCommonStartDate: {
                                    type: 'boolean',
                                    title: 'Common Start Date'
                                }
                            }
                        }
                    }
                }
            }
        },
        customControls: {
            "#/properties/chainId": {
                render: () => {
                    const networkPicker = new ScomNetworkPicker(undefined, {
                        type: 'combobox',
                        networks: chainIds.map(v => { return { chainId: v } })
                    });
                    return networkPicker;
                },
                getData: (control: ScomNetworkPicker) => {
                    return control.selectedNetwork?.chainId;
                },
                setData: (control: ScomNetworkPicker, value: number) => {
                    control.setNetworkByChainId(value);
                }
            }
        }
    },
    theme: {
        dataSchema: {
            type: 'object',
            properties: {
                "dark": {
                    type: 'object',
                    properties: theme
                },
                "light": {
                    type: 'object',
                    properties: theme
                }
            }
        }
    }
}