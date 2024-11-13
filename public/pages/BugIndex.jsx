import { bugService } from '../services/bug.service.js'
import { userService } from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../pages/BugFilter.jsx'

const { useState, useEffect } = React

export function BugIndex() {
  const [bugs, setBugs] = useState(null)
  const [filterBy, setFilterBy] = useState(bugService.getDefaultBugFilter())

  useEffect(() => {
    loadBugs()
  }, [filterBy])

  function loadBugs() {
    bugService
      .query(filterBy)
      .then((bugs) => setBugs(bugs))
      .catch((err) => {
        console.log('Have a bug to load Bugs...', err)
      })
  }

  function onSetFilter(filterBy) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }))
  }

  function onChangePageIdx(diff) {
    setFilterBy((prevFilter) => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + diff }))
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log('Deleted Succesfully!')
        const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
        setBugs(bugsToUpdate)
        showSuccessMsg('Bug removed')
      })
      .catch((err) => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      description: prompt('Bug description?'),
      severity: +prompt('Bug severity?')
    }
    bugService
      .save(bug)
      .then((savedBug) => {
        console.log('Added Bug', savedBug)
        setBugs([...bugs, savedBug])
        showSuccessMsg('Bug added')
      })
      .catch((err) => {
        console.log('Error from onAddBug ->', err)
        showErrorMsg('Cannot add bug')
      })
  }

  function onEditBug(bug) {
    const title = prompt('Bug title?')
    const severity = +prompt('New severity?')
    const description = prompt('Bug description?')

    const bugToSave = { ...bug, severity, description, title }
    bugService
      .save(bugToSave)
      .then((savedBug) => {
        console.log('Updated Bug:', savedBug)
        const bugsToUpdate = bugs.map((currBug) => (currBug._id === savedBug._id ? savedBug : currBug))
        setBugs(bugsToUpdate)
        showSuccessMsg('Bug updated')
      })
      .catch((err) => {
        console.log('Error from onEditBug ->', err)
        showErrorMsg('Cannot update bug')
      })
  }

  return (
    <main>
      <section className='info-actions'>
        <h3>Bugs App</h3>
        <div className='pageination-buttons'>
          <button onClick={() => onChangePageIdx(1)}>Next Page</button>
          <button onClick={() => onChangePageIdx(-1)}>Prev Page</button>
        </div>
        <BugFilter filterBy={filterBy} onSetFilter={onSetFilter} />
        <button onClick={onAddBug}>Add Bug ⛐</button>
      </section>

      <main>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
