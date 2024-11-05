const { useState } = React

export function BugFilter({ filterBy, onSetFilter }) {
  const [filterToEdit, setFilterToEdit] = useState({ ...filterBy })

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    if (field === 'severity' || field === 'sortDir') {
      value = +value
    }
    const updatedFilter = { ...filterToEdit, [field]: value }
    console.log(updatedFilter)

    setFilterToEdit(updatedFilter)
    onSetFilter(updatedFilter)

    // setFilterToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
  }

  // console.log(filterToEdit)

  const { title, severity, createdAt, sortBy, sortDir, labels } = filterToEdit

  return (
    <section className='bug-filter-container'>
      <div className='filter-severity'>
        <select onChange={handleChange} value={severity} name='severity'>
          <option value={0}>Filter by severity</option>
          <option value={1}>severity: 1</option>
          <option value={2}>severity: 2</option>
          <option value={3}>severity: 3</option>
          <option value={4}>severity: 4</option>
          <option value={5}>severity: 5</option>
        </select>
      </div>

      <div className='filter-severity'>
        <select onChange={handleChange} value={labels} name='labels'>
          <option value={''}>Filter By Labels:</option>
          <option value={'critical'}>Critical</option>
          <option value={'need-CR'}>Need-CR</option>
          <option value={'dev-branch'}>Dev-Branch</option>
        </select>
      </div>

      <div className='filter-severity'>
        <select onChange={handleChange} value={sortBy} name='sortBy'>
          <option>Sort By:</option>
          <option value={title}>title</option>
          <option value={severity}>severity</option>
          <option value={createdAt}>createdAt</option>
        </select>
      </div>

      <div className='filter-severity'>
        <label>
          Ascending:
          <input type='radio' onChange={handleChange} value={1} name='sortDir' checked={sortDir === 1} />
        </label>

        <label>
          Descending:
          <input type='radio' onChange={handleChange} value={-1} name='sortDir' checked={sortDir === -1} />
        </label>
      </div>

      <div className='filter-title'>
        <label htmlFor='bug-title'>
          <input type='search' value={title || ''} onChange={handleChange} name='title' id='bug-title' placeholder='Filter by title' />
        </label>
      </div>
    </section>
  )
}
