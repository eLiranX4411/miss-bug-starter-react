const { useState } = React

export function BugFilter({ filterBy, onSetFilter }) {
  const [filterToEdit, setFilterToEdit] = useState({ ...filterBy })

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    if (field === 'severity') {
      value = +value
    }
    // setFilterToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    const updatedFilter = { ...filterToEdit, [field]: value }
    setFilterToEdit(updatedFilter)

    onSetFilter(updatedFilter)
  }

  // console.log(filterToEdit)

  const { title, severity } = filterToEdit

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

      <div className='filter-title'>
        <label htmlFor='bug-title'>
          <input type='search' value={title || ''} onChange={handleChange} name='title' id='bug-title' placeholder='Filter by title' />
        </label>
      </div>
    </section>
  )
}
