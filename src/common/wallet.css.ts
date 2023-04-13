import { Styles } from '@ijstech/components';

export const walletModalStyle = Styles.style({
  backgroundColor: '#000',
  $nest: {
    '::-webkit-scrollbar-track': {
      backgroundColor: 'unset'
    },
    '::-webkit-scrollbar': {
      width: '5px',
      backgroundColor: 'unset'
    },
    '::-webkit-scrollbar-thumb': {
      background: 'rgba(255, 255, 255, 0.2) 0% 0% no-repeat padding-box',
      borderRadius: '5px',
    },
    '.btn': {
      height: 'auto !important',
      cursor: 'pointer',
      fontWeight: 600,
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5px',
      backgroundColor: 'transparent',
      $nest: {
        '&:hover': {
          transition: 'all .2s ease-out'
        }
      }
    },
    '.btn-connect': {
      padding: '.375rem .5rem',
      border: 'none',
      transition: 'all .2s ease-out',
      $nest: {
        '&:hover': {
          opacity: '.9',
          transition: 'all .2s ease-out',
        }
      }
    },
    '.os-modal': {
      borderRadius: 20,
      boxSizing: 'border-box',
      fontSize: '.875rem',
      fontWeight: 400,
      $nest: {
        'i-label': {
          color: '#fff'
        },
        'i-icon': {
          display: 'inline-block'
        },
        '.mr-2-5': {
          marginRight: '2.5rem'
        },
        '&.connect-modal > div > div': {
          width: 440,
          maxWidth: '100%',
          height: 'auto'
        },
        '&.connect-modal .i-modal_content': {
          padding: '0 1.5rem'
        },
        '> div > div': {
          backgroundColor: '#252a48',
          height: 'calc(100% - 160px)',
          borderRadius: 15,
          lineHeight: 1.5,
          wordWrap: 'break-word',
          padding: 0,
          minHeight: 400,
          width: 360
        },
        '.i-modal_content': {
          padding: '0 1.25rem'
        },
        '.i-modal_header': {
          borderRadius: '20px 20px 0 0',
          background: 'unset',
          padding: '16px 24px 0',
          $nest: {
            'span': {
              color: '#f15e61'
            }
          }
        },
        '.networkSection': {
          marginLeft: '-1.25rem',
          marginRight: '-1.25rem',
        },
        '.list-view': {
          $nest: {
            '.list-item:hover': {
              $nest: {
                '> *': {
                  opacity: 1
                }
              }
            },
            '.list-item:not(:first-child)': {
              marginTop: '.5rem'
            },
            '.list-item': {
              backgroundColor: '#0c1234',
              minHeight: '50px',
              position: 'relative',
              borderRadius: 10,
              cursor: 'pointer',
              border: 'none',
              transition: 'all .3s ease-in',
              overflow: 'unset',
              $nest: {
                '&.disabled-network-selection': {
                  cursor: 'default',
                  $nest: {
                    '&:hover > *': {
                      backgroundColor: '#0c1234',
                      opacity: '0.5 !important',
                    }
                  }
                },
                '> *': {
                  opacity: 0.8
                }
              }
            },
            '.list-item.is-actived': {
              $nest: {
                '> *': {
                  opacity: 1
                },
                '&:after': {
                  content: "''",
                  top: '50%',
                  left: 9,
                  position: 'absolute',
                  background: '#20bf55',
                  borderRadius: '50%',
                  width: 10,
                  height: 10,
                  transform: 'translate3d(-50%,-50%,0)'
                },
                '.custom-img': {
                  marginLeft: '.75rem'
                }
              }
            }
          }
        },
        '.networks': {
          display: 'flex',
          flexDirection: 'column',
          color: '#f05e61',
          marginTop: '1.5rem',
          height: 'calc(100% - 160px)',
          overflowY: 'auto',
          width: '100% !important',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          $nest: {
            '.list-item': {
              padding: '.5rem'
            }
          }
        },
        '.wallets': {
          marginTop: '.5rem',
          $nest: {
            '.list-item': {
              padding: '.5rem',
              position: 'relative',
            },
            '.list-item .image-container': {
              order: 2
            }
          }
        },
        '.small-label > *': {
          fontSize: '.875rem'
        },
        '.large-label > *': {
          fontSize: '1.25rem',
          lineHeight: 1.5
        },
        '.custom-link *': {
          color: '#fff'
        },
        '.custom-link a': {
          display: 'inline-flex',
          alignItems: 'center'
        }
      }
    }
  }
})
