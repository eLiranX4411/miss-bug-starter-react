import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('public/data/bugs.json')

export const bugService = {
  query,
  getById,
  remove,
  save
}

function query() {
  return Promise.resolve(bugs)
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
  return Promise.resolve(bug)
}

function remove(bugId) {}

function save(bugToSave) {}

function _saveCarsToFile() {}
