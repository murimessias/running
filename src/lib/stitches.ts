import { createStitches } from '@stitches/react'
import { theme } from 'styles/theme'

export const { styled, css, getCssText } = createStitches({
  theme: {
    ...theme,
  },
})
