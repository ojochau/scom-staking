import { Styles } from '@ijstech/components';
// import { maxWidth, maxHeight } from './store/index';
const Theme = Styles.Theme.ThemeVars;

// const colorVar = {
//   primaryButton: 'transparent linear-gradient(90deg, #AC1D78 0%, #E04862 100%) 0% 0% no-repeat padding-box',
//   primaryGradient: 'linear-gradient(255deg,#f15e61,#b52082)',
//   primaryDisabled: 'transparent linear-gradient(270deg,#351f52,#552a42) 0% 0% no-repeat padding-box !important'
// }

export const stakingDappContainer = Styles.style({
  $nest: {
    'dapp-container-body': {
      $nest: {
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px'
        },
        '&::-webkit-scrollbar-track': {
          borderRadius: '10px',
          border: '1px solid transparent',
          background: `${Theme.divider} !important`
        },
        '&::-webkit-scrollbar-thumb': {
          background: `${Theme.colors.primary.main} !important`,
          borderRadius: '10px',
          outline: '1px solid transparent'
        }
      }
    }
  }
})

export const stakingComponent = Styles.style({
  $nest: {
    '.btn-os': {
      background: 'var(--primary-button-background)',
      // height: 'auto !important',
      // color: '#fff',
      // color: Theme.colors.primary.contrastText,
      // fontSize: '1rem',
      // fontWeight: 'bold',
      transition: 'background .3s ease',
      boxShadow: 'none',
      $nest: {
        // 'i-icon.loading-icon': {
        //   marginInline: '0.25rem',
        //   width: '16px !important',
        //   height: '16px !important',
        // },
        // 'svg': {
        //   // fill: `${Theme.colors.primary.contrastText} !important`
        //   fill: `#fff !important`
        // }
      },
    },
    '.btn-os:not(.disabled):not(.is-spinning):hover, .btn-os:not(.disabled):not(.is-spinning):focus': {
      background: 'var(--primary-button-hover-background)',
      opacity: .9
    },
    '.btn-os:not(.disabled):not(.is-spinning):focus': {
      boxShadow: '0 0 0 0.2rem rgb(0 123 255 / 25%)'
    },
    '.btn-os.disabled, .btn-os.is-spinning': {
      background: 'var(--primary-button-disabled-background)',
      opacity: 1
    },
    '.wrapper': {
      $nest: {
        '.sticker': {
          transform: 'rotate(45deg)'
        },
        // '.bg-color': {
        //   display: 'flex',
        //   flexDirection: 'column',
        //   color: '#fff',
        //   minHeight: '485px',
        //   height: '100%',
        //   borderRadius: '15px',
        //   paddingBottom: '1rem',
        //   position: 'relative',
        // }
      },
    },
    // '#loadingElm.i-loading--active': {
    //   marginTop: '2rem',
    //   position: 'initial',
    //   $nest: {
    //     '#stakingElm': {
    //       display: 'none !important',
    //     },
    //     '.i-loading-spinner': {
    //       marginTop: '2rem',
    //     },
    //   },
    // }
  }
})
