import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { usePagination, useSortBy, useTable } from 'react-table'
import api from 'lib/axios'
import { styled } from 'lib/stitches'
import { Team, Meta } from 'types/requests'

const Wrapper = styled('div', {
  alignItems: 'center',
  backgroundColor: '$gray1',
  display: 'flex',
  justifyContent: 'center',
  height: '100vh',
})

const Content = styled('div', {
  color: '$gray11',
})

const Table = styled('table', {})
const Head = styled('thead', {})
const Header = styled('th', {})
const Row = styled('tr', {})
const Body = styled('tbody', {})
const Data = styled('td', {})

const Button = styled('button', {
  alignItems: 'center',
  backgroundColor: '$orange10',
  border: 'none',
  borderRadius: '.8rem',
  color: '$orange2',
  cursor: 'pointer',
  display: 'inline-flex',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  fontWeight: '$bold',
  justifyContent: 'center',
  lineHeight: '1.1',
  minHeight: '4.4rem',
  minWidth: '10ch',
  padding: '0.25em 0.75em',
  textAlign: 'center',
  transition: '200ms all ease-in-out',

  '&:hover': {
    backgroundColor: '$orange11',
  },

  '&:active': {
    backgroundColor: '$orange9',
  },

  '&:disabled': {
    backgroundColor: '$orange6',
    color: '$orange1',
    cursor: 'not-allowed',
  },

  '&:focus': {
    boxShadow: '0 0 0 4px var(--colors-orange6)',
    outlineStyle: 'solid',
    outlineColor: 'transparent',
  },

  '@media screen and (-ms-high-contrast:active)': {
    border: '2px solid currentColor',
  },

  variants: {
    size: {
      sm: {
        fontSize: '$sm',
        minHeight: '3.6rem',
      },
    },
  },
})

const columns = [
  { Header: 'ID', accessor: 'id' },
  { Header: 'Abbreviation', accessor: 'abbreviation' },
  { Header: 'Full Name', accessor: 'full_name' },
  { Header: 'City', accessor: 'city' },
  { Header: 'Conference', accessor: 'conference' },
  { Header: 'Division', accessor: 'division' },
] as const

type GetTeamsResponse = {
  data: Array<Team>
  meta: Meta
}

const fetchTeams = async ({ page = 1, limit = 5 }) => {
  const res = await api.get<GetTeamsResponse>(
    `/teams?page=${page + 1}&per_page=${limit}`,
  )
  return res.data
}

const Teams = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const fetchOptions = {
    page: pageIndex + 1,
    limit: pageSize,
  }

  const dataQuery = useQuery(
    ['teams', fetchOptions],
    () => fetchTeams({ page: pageIndex, limit: pageSize }),
    {
      keepPreviousData: true,
    },
  )

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
      pageCount: dataQuery.data?.meta.total_pages ?? -1,
    }),
    [pageIndex, pageSize, dataQuery.data?.meta.total_pages],
  )

  const defaultData = useMemo(() => [], [])

  const memoData = useMemo(() => dataQuery.data?.data, [dataQuery.data?.data])
  const memoColumns = useMemo(() => columns, [])

  const instance = useTable(
    {
      columns: memoColumns,
      data: memoData ?? defaultData,
      initialState: pagination,
      manualPagination: true,
      pageCount: dataQuery.data?.meta.total_pages,
    },
    useSortBy,
    usePagination,
  )

  const {
    canNextPage,
    canPreviousPage,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
  } = instance

  const handleAddPage = () =>
    setPagination((old) => ({ ...old, pageIndex: pageIndex + 1 }))

  const handleRemovePage = () =>
    setPagination((old) => ({ ...old, pageIndex: Math.max(pageIndex - 1, 0) }))

  return (
    <Wrapper>
      <Content>
        {dataQuery.isLoading ? (
          <p>Loading data...</p>
        ) : (
          <Table {...getTableProps()}>
            <Head>
              {headerGroups.map((headerGroup, index) => (
                <Row {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((header) => (
                    // eslint-disable-next-line react/jsx-key
                    <Header
                      {...header.getHeaderProps(header.getSortByToggleProps())}
                    >
                      {header.render('Header')}
                      <span>
                        {header.isSorted
                          ? header.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </Header>
                  ))}
                </Row>
              ))}
            </Head>

            <Body {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row)
                return (
                  <Row {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell, index) => (
                      <Data {...cell.getCellProps()} key={index}>
                        {cell.render('Cell')}
                      </Data>
                    ))}
                  </Row>
                )
              })}
            </Body>
          </Table>
        )}

        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <Button
            disabled={!canPreviousPage}
            onClick={handleRemovePage}
            size='sm'
          >
            Previous
          </Button>
          <Button
            disabled={!canNextPage || !dataQuery.data?.data}
            onClick={handleAddPage}
            size='sm'
          >
            Next
          </Button>
        </div>

        <hr style={{ margin: '16px 0' }} />
        <div>
          Showing {dataQuery.data?.data.length} results from{' '}
          {dataQuery.data?.meta.total_count}{' '}
          {dataQuery.isFetching && <span>...</span>}
        </div>
      </Content>
    </Wrapper>
  )
}

export default Teams
