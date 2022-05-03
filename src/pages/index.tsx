import type { NextPage } from 'next'
import { styled } from '@stitches/react'

const Wrapper = styled('div', {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  height: '100vh',
})

const Content = styled('div', {
  fontFamily: 'sans-serif',
  fontSize: 36,
  fontWeight: 'bold',
})

const Home: NextPage = () => {
  return (
    <Wrapper>
      <Content>Hello NextJS</Content>
    </Wrapper>
  )
}

export default Home
