import { LockTokenType } from '../../../global/index';

const USDPeggedTokenAddressMap: { [key: number]: string } = {
  56: '0xe9e7cea3dedca5984780bafc599bd69add087d56', //BUSD
  97: '0xDe9334C157968320f26e449331D6544b89bbD00F', //BUSD
  43113: '0xb9c31ea1d475c25e58a1be1a46221db55e5a7c6e', //USDT.e
  43114: '0xc7198437980c041c805a1edcba50c1ce5db95118', //USDT.e
}

const getSingleStakingSchema = (readOnly?: boolean) => {
  return {
    type: 'object',
    properties: {
      chainId: {
        type: 'number',
        enum: [1, 56, 137, 250, 97, 80001, 43113, 43114],
        required: true,
        readOnly
      },
      customName: {
        type: 'string',
        label: 'Campaign Name',
        required: true,
        readOnly
      },
      customDesc: {
        type: 'string',
        label: 'Campaign Description',
        readOnly
      },
      customLogo: {
        type: 'string',
        title: 'Campaign Logo',
        readOnly
      },
      getTokenURL: {
        type: 'string',
        title: 'Token Trade URL',
        readOnly
      },
      showContractLink: {
        type: 'boolean',
        readOnly
      },
      stakings: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            required: true,
            readOnly
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
            required: true,
            readOnly
          },
          rewards: {
            type: 'object',
            properties: {
              address: {
                type: 'string',
                required: true,
                readOnly
              },
              isCommonStartDate: {
                type: 'boolean',
                title: 'Common Start Date',
                readOnly
              }
            }
          }
        }
      }
    }
  }
}

// const getStakingSchema = (readOnly?: boolean) => {
//   return {
//     type: 'object',
//     properties: {
//       chainId: {
//         type: 'number',
//         enum: [1, 56, 137, 250, 97, 80001, 43113, 43114],
//         required: true,
//         readOnly
//       },
//       customName: {
//         type: 'string',
//         label: 'Campaign Name',
//         required: true,
//         readOnly
//       },
//       customDesc: {
//         type: 'string',
//         label: 'Campaign Description',
//         readOnly
//       },
//       customLogo: {
//         type: 'string',
//         title: 'Campaign Logo',
//         readOnly
//       },
//       getTokenURL: {
//         type: 'string',
//         title: 'Token Trade URL',
//         readOnly
//       },
//       campaignStart: {
//         type: 'number',
//         required: true,
//         readOnly
//       },
//       campaignEnd: {
//         type: 'number',
//         required: true,
//         readOnly
//       },
//       showContractLink: {
//         type: 'boolean',
//         readOnly
//       },
//       admin: {
//         type: 'string',
//         required: true,
//         readOnly
//       },
//       stakings: {
//         type: 'object',
//         properties: {
//           address: {
//             type: 'string',
//             readOnly
//           },
//           lockTokenAddress: {
//             type: 'string',
//             required: true,
//             readOnly
//           },
//           minLockTime: {
//             type: 'number',
//             title: 'Locking Time',
//             required: true,
//             readOnly
//           },
//           minLockTimeUnit: {
//             type: 'number',
//             title: 'Unit',
//             oneOf: [
//               {
//                 title: 'Hour(s)',
//                 const: 1
//               },
//               {
//                 title: 'Day(s)',
//                 const: 24
//               },
//               {
//                 title: 'Week(s)',
//                 const: 7 * 24
//               },
//             ],
//             required: true,
//             readOnly
//           },
//           maxTotalLock: {
//             type: 'number',
//             required: true,
//             readOnly
//           },
//           perAddressCap: {
//             type: 'number',
//             required: true,
//             readOnly
//           },
//           customDesc: {
//             type: 'string',
//             title: 'Staking Description',
//             readOnly
//           },
//           lockTokenType: {
//             type: 'number',
//             oneOf: [
//               { title: 'ERC20_Token', const: LockTokenType.ERC20_Token },
//               { title: 'LP_Token', const: LockTokenType.LP_Token },
//               { title: 'VAULT_Token', const: LockTokenType.VAULT_Token },
//             ],
//             required: true,
//             readOnly
//           },
//           rewards: {
//             type: 'object',
//             properties: {
//               address: {
//                 type: 'string',
//                 readOnly
//               },
//               rewardTokenAddress: {
//                 type: 'string',
//                 required: true,
//                 readOnly
//               },
//               multiplier: {
//                 type: 'number',
//                 title: 'Reward Factor',
//                 required: true,
//                 readOnly
//               },
//               // rewardAmount: {
//               //   type: 'number',
//               //   readOnly
//               // },
//               initialReward: {
//                 type: 'number',
//                 title: 'Upfront Reward Ratio',
//                 required: true,
//                 readOnly,
//                 minimum: 0,
//                 maximum: 1
//               },
//               vestingPeriod: {
//                 type: 'number',
//                 title: 'Reward Vesting',
//                 required: true,
//                 readOnly
//               },
//               vestingPeriodUnit: {
//                 type: 'number',
//                 title: 'Unit',
//                 oneOf: [
//                   {
//                     title: 'Hour(s)',
//                     const: 1
//                   },
//                   {
//                     title: 'Day(s)',
//                     const: 24
//                   },
//                   {
//                     title: 'Week(s)',
//                     const: 7 * 24
//                   },
//                 ],
//                 required: true,
//                 readOnly
//               },
//               claimDeadline: {
//                 type: 'number',
//                 title: 'Admin Claim Deadline',
//                 required: true,
//                 readOnly
//               },
//               isCommonStartDate: {
//                 type: 'boolean',
//                 title: 'Common Start Date',
//                 readOnly
//               },
//               vestingStartDate: {
//                 type: 'number',
//                 readOnly
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }

// const getStakingUISchema = () => {
//   return {
//     type: 'Group',
//     elements: [
//       {
//         type: 'Group',
//         label: 'Campaign',
//         elements: [
//           {
//             type: 'Control',
//             scope: '#/properties/chainId'
//           },
//           {
//             type: 'Control',
//             label: 'Campaign Name',
//             scope: '#/properties/customName'
//           },
//           {
//             type: 'Control',
//             label: 'Campaign Description',
//             scope: '#/properties/customDesc'
//           },
//           {
//             type: 'Control',
//             label: 'Campaign Logo',
//             scope: '#/properties/customLogo'
//           },
//           {
//             type: 'Control',
//             label: 'Token Trade URL',
//             scope: '#/properties/getTokenURL'
//           },
//           {
//             type: 'Control',
//             scope: '#/properties/campaignStart'
//           },
//           {
//             type: 'Control',
//             scope: '#/properties/campaignEnd'
//           },
//           {
//             type: 'Control',
//             scope: '#/properties/showContractLink'
//           },
//           {
//             type: 'Control',
//             scope: '#/properties/admin'
//           },
//           {
//             type: 'Group',
//             label: 'Staking',
//             elements: [
//               {
//                 type: 'Control',
//                 scope: '#/properties/stakings/properties/address'
//               },
//               {
//                 type: 'Control',
//                 scope: '#/properties/stakings/properties/lockTokenAddress'
//               },
//               {
//                 type: 'HorizontalLayout',
//                 elements: [
//                   {
//                     type: 'Control',
//                     label: 'Locking Time',
//                     scope: '#/properties/stakings/properties/minLockTime'
//                   },
//                   {
//                     type: 'Control',
//                     label: 'Unit',
//                     scope: '#/properties/stakings/properties/minLockTimeUnit'
//                   }
//                 ],
//               },
//               {
//                 type: 'Control',
//                 scope: '#/properties/stakings/properties/maxTotalLock'
//               },
//               {
//                 type: 'Control',
//                 scope: '#/properties/stakings/properties/perAddressCap'
//               },
//               {
//                 type: 'Control',
//                 label: 'Staking Description',
//                 scope: '#/properties/stakings/properties/customDesc'
//               },
//               {
//                 type: 'Control',
//                 scope: '#/properties/stakings/properties/lockTokenType'
//               },
//               {
//                 type: 'Group',
//                 label: 'Reward',
//                 elements: [
//                   {
//                     type: 'Control',
//                     scope: '#/properties/stakings/properties/rewards/properties/address'
//                   },
//                   {
//                     type: 'Control',
//                     scope: '#/properties/stakings/properties/rewards/properties/rewardTokenAddress'
//                   },
//                   {
//                     type: 'Control',
//                     label: 'Reward Factor',
//                     scope: '#/properties/stakings/properties/rewards/properties/multiplier'
//                   },
//                   {
//                     type: 'Control',
//                     label: 'Upfront Reward Ratio',
//                     scope: '#/properties/stakings/properties/rewards/properties/initialReward'
//                   },
//                   {
//                     type: 'HorizontalLayout',
//                     elements: [
//                       {
//                         type: 'Control',
//                         label: 'Reward Vesting',
//                         scope: '#/properties/stakings/properties/rewards/properties/vestingPeriod'
//                       },
//                       {
//                         type: 'Control',
//                         label: 'Unit',
//                         scope: '#/properties/stakings/properties/rewards/properties/vestingPeriodUnit'
//                       },
//                     ]
//                   },
//                   {
//                     type: 'Control',
//                     label: 'Admin Claim Deadline',
//                     scope: '#/properties/stakings/properties/rewards/properties/claimDeadline'
//                   },
//                   {
//                     type: 'Control',
//                     label: 'Common Start Date',
//                     scope: '#/properties/stakings/properties/rewards/properties/isCommonStartDate'
//                   },
//                   {
//                     type: 'Control',
//                     scope: '#/properties/stakings/properties/rewards/properties/vestingStartDate'
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// }

export {
  getSingleStakingSchema,
  LockTokenType,
  USDPeggedTokenAddressMap
}
