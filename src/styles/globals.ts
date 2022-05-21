import { globalCss } from '@stitches/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,

    '&::before, &::after': {
      boxSizing: 'inherit',
    },
  },

  html: {
    fontSize: '62.5%',
  },

  'html, body, #__next': {
    minHeight: '100%',
  },

  body: {
    fontSize: 'var(--fontSizes-md)',
    fontFamily: 'sans-serif',
  },
})
