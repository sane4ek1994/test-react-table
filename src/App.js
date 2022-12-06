import { useState, useEffect } from 'react'
import { useHttp } from './hooks/http.hook'
import { Table, PerPageSelect, SearchInput, SearchSelects, Pagination } from './components'
import sortData from './helpers/sort-data'
import './App.css'

function App() {
  const { request, process, setProcess } = useHttp()

  const [data, setData] = useState([])

  const [dataPerPage, setDataPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [term, setTerm] = useState('')

  const [columnsFilter, setColumnsFilter] = useState('default')
  const [conditionFilter, setConditionFilter] = useState('default')

  const filterConditionData = (items, inputTerm, activeFilter, filter) => {
    const lowerTerm = inputTerm.toLowerCase()

    switch (filter) {
      case 'default':
        return items
      case 'equal':
        return items.filter(item => {
          const lowerName = String(item[activeFilter]).toLowerCase()
          return lowerName === lowerTerm
        })
      case 'contain':
        return items.filter(item => {
          const lowerName = String(item[activeFilter]).toLowerCase()
          return lowerName.indexOf(lowerTerm) > -1
        })
      case 'more':
        return sortData(activeFilter, items, lowerTerm, 'more')
      case 'less':
        return sortData(activeFilter, items, lowerTerm, 'less')

      default:
        return items
    }
  }

  useEffect(() => {
    request('http://localhost:3001/data')
      .then(setData)
      .then(() => setProcess('confirmed'))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChangeDataPerPage = e => {
    setProcess('loading')
    setDataPerPage(+e.target.value)
    setTimeout(() => {
      setProcess('confirmed')
    }, 300)
  }

  const visibleData = filterConditionData(data, term, columnsFilter, conditionFilter)

  const indexOfLastPost = currentPage * dataPerPage
  const indexOfFirstPost = indexOfLastPost - dataPerPage

  const currentData = visibleData.slice(indexOfFirstPost, indexOfLastPost)

  const paginatePage = pageNumber => setCurrentPage(pageNumber)

  return (
    <div className='App'>
      <div className='App-container'>
        <section className='search-panel'>
          <SearchInput term={term} setTerm={setTerm} />
          <SearchSelects setColumnsFilter={setColumnsFilter} setConditionFilter={setConditionFilter} />
          <PerPageSelect dataPerPage={dataPerPage} onChangeDataPerPage={onChangeDataPerPage} />
        </section>

        <Table data={currentData} process={process} />
        <Pagination dataPerPage={dataPerPage} totalData={data.length} paginatePage={paginatePage} />
      </div>
    </div>
  )
}

export default App
