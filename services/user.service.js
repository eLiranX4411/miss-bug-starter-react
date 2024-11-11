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
  var user = users.find((user) => user._id === userId)
  if (!user) return Promise.reject('User not found!')

  user = {
    _id: user._id,
    username: user.username,
    fullname: user.fullname
  }

  return Promise.resolve(user)
}

function save(userToSave) {}

function remove(userId) {
  users = users.filter((user) => user._id !== userId)
  return _saveUserToFile()
}

function checkLogin() {}

function getLoginToken() {}

function validateToken() {}

function _saveUserToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(users, null, 4)
    fs.writeFile('public/data/users.json', data, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}
