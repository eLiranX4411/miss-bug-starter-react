import { utilService } from './util.service.js'

// FRONTEND SERVICE ---------------------------------

const BASE_URL = '/api/bug/'

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultBugFilter
}

function query(filterBy = {}) {
  return axios
    .get(BASE_URL, { params: filterBy })
    .then((res) => res.data)
    .catch((err) => {
      console.error('Problem Getting bugs', err)
    })
}

function getById(bugId) {
  return axios.get(BASE_URL + bugId).then((res) => res.data)
}

function remove(bugId) {
  return axios.delete(BASE_URL + bugId).then((res) => res.data)
}

function save(bug) {
  if (bug._id) {
    return axios
      .put(BASE_URL + bug._id, bug)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err)
      })
  } else {
    return axios
      .post(BASE_URL, bug)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err)
      })
  }
}

function getDefaultBugFilter() {
  return {
    title: '',
    severity: 0,
    pageIdx: 0,
    sortBy: '',
    sortDir: 0,
    labels: []
  }
}
