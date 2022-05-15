import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useQuery, useQueryClient } from 'react-query'
import api from 'lib/axios'
import { styled } from 'lib/stitches'

const Wrapper = styled('div', {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  height: '100vh',
})

const Content = styled('div', {
  fontFamily: 'sans-serif',
  fontSize: '$sm',
  p: '$4',
})

type Team = {
  abbreviation: string
  city: string
  conference: string
  division: string
  full_name: string
  id: number
  name: string
}

type GetTeamResponse = {
  data: Team[]
  meta: {
    current_page: number
    next_page: null | number
    per_page: number
    total_count: number
    total_pages: number
  }
}

const getTeams = async (
  page: number,
  limit: number,
): Promise<GetTeamResponse> => {
  const { data } = await api.get(`/teams?page=${page}&per_page=${limit}`)
  return data
}

const Home: NextPage = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)

  const { data, isLoading, isError, isPreviousData, isFetching } = useQuery(
    ['teams', page, limit],
    () => getTeams(page, limit),
    { keepPreviousData: true, staleTime: 1000 },
  )

  useEffect(() => {
    if (data?.meta.next_page) {
      queryClient.prefetchQuery(['teams', page + 1, limit], () =>
        getTeams(page + 1, limit),
      )
    }
  }, [data, page, limit, queryClient])

  if (isLoading)
    return (
      <Content>
        <div>Carregando... </div>
      </Content>
    )

  if (isError || !data)
    return (
      <Content>
        <div>Erro de serviço</div>
      </Content>
    )

  const hasMore = data.meta.next_page
  const handleRemovePage = () => setPage((old) => Math.max(old - 1, 0))
  const handleAddPage = () =>
    (!isPreviousData || hasMore) && setPage((old) => old + 1)

  return (
    <Wrapper>
      <Content>
        {data.data.map((team) => (
          <div key={team.id}>{team.name}</div>
        ))}
        <div style={{ marginTop: 12 }}>
          Página {data.meta.current_page} {isFetching && '...'}
        </div>
        <button onClick={handleRemovePage} disabled={page === 1}>
          Página anterior
        </button>
        <button onClick={handleAddPage} disabled={isPreviousData || !hasMore}>
          Próxima página
        </button>
        <button
          onClick={() => {
            setLimit(3)
          }}
        >
          Limitar para 3
        </button>
      </Content>
    </Wrapper>
  )
}

export default Home
