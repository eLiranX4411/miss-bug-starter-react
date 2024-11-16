import fs from 'fs'
import { utilService } from './util.service.js'

// BACKEND SERVICE ---------------------------------

const bugs = utilService.readJsonFile('public/data/bugs.json')

export const bugService = {
  query,
  getById,
  remove,
  save
}

function query(filterBy, sortBy) {
  let filteredBugs = bugs

  if (filterBy.title) {
    const regExp = new RegExp(filterBy.title, 'i')
    filteredBugs = filteredBugs.filter((bug) => regExp.test(bug.title))
  }

  if (filterBy.severity) {
    filteredBugs = filteredBugs.filter((bug) => bug.severity >= filterBy.severity)
  }

  if (filterBy.labels.length) {
    filteredBugs = filteredBugs.filter((bug) => filterBy.labels.some((label) => bug.labels.includes(label)))
    console.log(filteredBugs)
  }

  if (filterBy.pageIdx !== undefined) {
    const pageIdx = filterBy.pageIdx
    const pageSize = 4
    const startIdx = pageIdx * pageSize
    const endIdx = startIdx + pageSize

    filteredBugs = filteredBugs.slice(startIdx, endIdx)
  }

  if (sortBy) {
    const { title, severity, createdAt, sortDir } = sortBy
    let sortField

    if (title) sortField = 'title'
    else if (severity) sortField = 'severity'
    else if (createdAt) sortField = 'createdAt'

    if (sortField) {
      filteredBugs = filteredBugs.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDir === 1 ? -1 : 1
        if (a[sortField] > b[sortField]) return sortDir === 1 ? 1 : -1
        return 0
      })
    }
  }

  return Promise.resolve(filteredBugs)
}

function save(bugToSave, user) {
  const bugIdx = bugs.findIndex((bug) => bug._id === bugToSave._id)

  if (bugToSave._id) {
    if (!user.isAdmin && bugs[bugIdx].creator._id !== user._id) {
      console.log(`Bug does not belong to user: ${user._id}`)
      return Promise.reject('Not your bug')
    }

    bugs[bugIdx] = { ...bugs[bugIdx], ...bugToSave, updatedAt: Date.now() }
    console.log('put: ', bugToSave)
  } else {
    bugToSave = { ...bugToSave, _id: utilService.makeId(), createdAt: Date.now(), creator: { _id: user._id, fullname: user.fullname } }
    console.log('post: ', bugToSave)
    bugs.unshift(bugToSave)
  }

  return _saveBugsToFile().then(() => bugToSave)
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
  return Promise.resolve(bug)
}

function remove(bugId, user) {
  const bugIdx = bugs.findIndex((bug) => bug._id === bugId)

  if (!user.isAdmin && bugs[bugIdx].creator._id !== user._id) {
    console.log(`Bug does not belong to user: ${user._id}`)
    return Promise.reject('Not your bug')
  }

  if (bugIdx < 0) return Promise.reject('Cannot find bug - ' + bugId)
  bugs.splice(bugIdx, 1)

  //   return Promise.resolve(bugId + ' Remove Success!')
  return _saveBugsToFile()
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4)
    fs.writeFile('public/data/bugs.json', data, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}
