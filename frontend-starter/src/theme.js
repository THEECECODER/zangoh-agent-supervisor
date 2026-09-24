import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
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
  styles:{ global:{ body:{ bg:'#f6f7fb', color:'#18202b', fontSize:'14px' }, '*':{ boxSizing:'border-box' } } },
  components:{
    Button:{ baseStyle:{ fontWeight:600, borderRadius:'7px' }, variants:{
      solid:{ bg:'brand.500', color:'white', _hover:{bg:'brand.600'} },
      outline:{ borderColor:'brand.500', color:'brand.600', _hover:{bg:'brand.50'} },
      ghost:{ _hover:{bg:'gray.100'} }
    }},
    Input:{ defaultProps:{size:'sm'} },
    Select:{ defaultProps:{size:'sm'} }
  }
});
export default theme;