import fs from 'fs'
import Cryptr from 'cryptr'

import { utilService } from './util.service.js'

// BACKEND USER SERVICE ---------------------------------

const cryptr = new Cryptr(process.env.SECRET1 || 'secret-puk-1234')
const users = utilService.readJsonFile('public/data/user.json')

export const userService = {
  query,
  getById,
  remove,
  save,

  checkLogin,
  getLoginToken,
  validateToken
}

function query() {
  const usersToReturn = users.map((user) => ({ _id: user._id, fullname: user.fullname }))
  return Promise.resolve(usersToReturn)
}

function getById(userId) {
  let user = users.find((user) => user._id === userId)
  if (!user) return Promise.reject('User not found!')

  user = {
    _id: user._id,
    username: user.username,
    fullname: user.fullname
  }

  return Promise.resolve(user)
}

function save(userToSave) {
  userToSave.isAdmin = false
  userToSave._id = utilService.makeId()
  users.push(userToSave)

  return _saveUserToFile().then(() => ({
    _id: userToSave._id,
    fullname: userToSave.fullname,
    isAdmin: userToSave.isAdmin
  }))
}

function remove(userId) {
  const userIdx = users.findIndex((user) => user._id === userId)
  if (userIdx < 0) return Promise.reject('Cannot find user - ' + userId)
  users.splice(userIdx, 1)

  return _saveUserToFile()
}

function checkLogin({ username, password }) {
  // You might want to remove the password validation for dev
  // && user.password === password
  let user = users.find((user) => user.username === username)
  if (user) {
    user = {
      _id: user._id,
      fullname: user.fullname,
      isAdmin: user.isAdmin
    }
  }
  return Promise.resolve(user)
}

function getLoginToken(user) {
  const str = JSON.stringify(user)
  const encryptedStr = cryptr.encrypt(str)
  return encryptedStr
}

function validateToken(token) {
  if (!token) return null
  const str = cryptr.decrypt(token)
  const user = JSON.parse(str)
  return user
}

function _saveUserToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(users, null, 4)
    fs.writeFile('public/data/user.json', data, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}
