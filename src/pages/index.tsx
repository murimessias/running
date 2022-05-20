import type { NextPage } from 'next'
import Link from 'next/link'
import { styled } from 'lib/stitches'

const Wrapper = styled('div', {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: 'Black',
  color: 'GrayText',
})

const Content = styled('div', {
  fontFamily: 'sans-serif',
  fontSize: '$sm',
  p: '$4',
})

const Home: NextPage = () => {
  return (
    <Wrapper>
      <Content>
        <Link href='/teams'>
          <a>Teams</a>
        </Link>
      </Content>
    </Wrapper>
  )
}

export default Home
