import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: { 50:'#f5f1ff',100:'#e9e1ff',200:'#d5c7ff',300:'#b9a2ff',400:'#8c6cf0',500:'#5b3f91',600:'#4b3280',700:'#3b2767',800:'#2b1d4e',900:'#1d1436' },
    ink:'#18202b',
    muted:'#687386',
    surface:'#ffffff',
    canvas:'#f6f7fb',
    success:'#1f9d68',
    warning:'#d99a24',
    danger:'#dc5b62'
  },
  fonts:{ heading:'Inter, system-ui, sans-serif', body:'Inter, system-ui, sans-serif' },
  styles:{
    global:(props)=>({
      body:{
        bg:props.colorMode==='dark'?'#11131a':'#f6f7fb',
        color:props.colorMode==='dark'?'#edf0f7':'#18202b',
        fontSize:'14px',
        transition:'background-color .2s ease, color .2s ease'
      },
      '*':{ boxSizing:'border-box' },
      '::-webkit-scrollbar':{width:'8px',height:'8px'},
      '::-webkit-scrollbar-thumb':{background:props.colorMode==='dark'?'#454957':'#c9ccd6',borderRadius:'8px'},
      '[data-theme="dark"] .chakra-card,[data-theme="dark"] .chakra-modal__content,[data-theme="dark"] .chakra-menu__menu-list':{
        background:'#1b1e27',
        color:'#edf0f7',
        borderColor:'#343844'
      }
    })
  },
  semanticTokens:{
    colors:{
      pageBg:{default:'#f6f7fb',_dark:'#11131a'},
      surface:{default:'#ffffff',_dark:'#1b1e27'},
      surfaceSubtle:{default:'#f8f9fc',_dark:'#20232d'},
      border:{default:'#e2e6ee',_dark:'#343844'},
      textPrimary:{default:'#18202b',_dark:'#edf0f7'},
      textSecondary:{default:'#687386',_dark:'#aeb5c4'}
    }
  },
  components:{
    Button:{ baseStyle:{ fontWeight:600, borderRadius:'7px' }, variants:{
      solid:{ bg:'brand.500', color:'white', _hover:{bg:'brand.600'} },
      outline:{ borderColor:'brand.500', color:'brand.600', _hover:{bg:'brand.50'} },
      ghost:{ _hover:{bg:'gray.100',_dark:{bg:'whiteAlpha.100'}} }
    }},
    Input:{ defaultProps:{size:'sm'} },
    Select:{ defaultProps:{size:'sm'} }
  }
});
export default theme;