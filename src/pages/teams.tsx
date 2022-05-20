import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { usePagination, useSortBy, useTable } from 'react-table'
import api from 'lib/axios'
import { styled } from 'lib/stitches'
import { Team, Meta } from 'types/requests'

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

const Row = styled('tr', {})

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
    pageSize: 7,
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

  return (
    <Wrapper>
      <Content>
        {dataQuery.isLoading ? (
          <p>Loading data...</p>
        ) : (
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <Row {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((header) => (
                    // eslint-disable-next-line react/jsx-key
                    <th
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
                    </th>
                  ))}
                </Row>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row)
                return (
                  <Row {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell, index) => (
                      <td {...cell.getCellProps()} key={index}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </Row>
                )
              })}
            </tbody>
          </table>
        )}

        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <button
            disabled={!canPreviousPage}
            onClick={() =>
              setPagination(
                (old) =>
                  (old = { ...old, pageIndex: Math.max(pageIndex - 1, 0) }),
              )
            }
          >
            Previous Page
          </button>
          <button
            disabled={!canNextPage || !dataQuery.data?.data}
            onClick={() =>
              setPagination(
                (old) => (old = { ...old, pageIndex: pageIndex + 1 }),
              )
            }
          >
            Next Page
          </button>
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
