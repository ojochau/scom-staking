import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export const stakingManageStakeStyle = Styles.style({
  $nest: {
    'input': {
      $nest: {
        '&::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          margin: '0',
        },
        '&::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: '0',
        },
      }
    }
  }
})