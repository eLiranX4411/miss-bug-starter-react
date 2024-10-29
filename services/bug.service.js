import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('public/data/bugs.json')

export const bugService = {
  query,
  getById,
  visitById,
  remove,
  save
}

function query() {
  return Promise.resolve(bugs)
}

function save(bugToSave) {
  if (bugToSave._id) {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugToSave._id)
    bugs[bugIdx] = bugToSave
  } else {
    bugToSave._id = utilService.makeId()
    bugs.unshift(bugToSave)
  }
  return _saveBugsToFile().then(() => bugToSave)
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
  return Promise.resolve(bug)
}

function visitById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
  return Promise.resolve(bug)
}

function remove(bugId) {
  const bugIdx = bugs.findIndex((bug) => bug._id === bugId)
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
