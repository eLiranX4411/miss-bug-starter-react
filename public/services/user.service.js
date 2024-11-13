import { utilService } from './util.service.js'

// FRONTEND USER SERVICE ---------------------------------

// some id to delete / query / getbyid
const BASE_URL = '/api/user/'

// Signup / Login / Logout
const BASE_AUTH_URL = '/api/auth/'

// Storage Session key
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

export const userService = {
  login,
  signup,
  logout,
  getLoggedinUser,

  getById,
  getEmptyCredentials
}

function getById(userId) {
  return axios.get(BASE_URL + userId).then((res) => res.data)
}

function signup({ username, password, fullname }) {
  return axios
    .post(BASE_AUTH_URL + 'signup', { username, password, fullname })
    .then((res) => res.data)
    .then((user) => {
      _setLoggedinUser(user)
      return user
    })
}

function login({ username, password }) {
  return axios
    .post(BASE_AUTH_URL + 'login', { username, password })
    .then((res) => res.data)
    .then((user) => {
      _setLoggedinUser(user)
      return user
    })
}

function logout() {
  return axios.post(BASE_AUTH_URL + 'logout').then(() => {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  })
}

function _setLoggedinUser(user) {
  const userToSave = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
  return userToSave
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getEmptyCredentials() {
  return {
    username: '',
    password: '',
    fullname: ''
  }
}
