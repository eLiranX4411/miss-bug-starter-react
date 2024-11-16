import fs from 'fs'
import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'
import { bugService } from './services/bug.service.js'
import { utilService } from './services/util.service.js'
import { userService } from './services/user.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Bugs Routes------------------------------------

// GET

app.get('/api/bug', (req, res) => {
  const filterBy = {
    title: req.query.title || '',
    severity: +req.query.severity || 0,
    pageIdx: +req.query.pageIdx || 0,
    labels: req.query.labels ? req.query.labels.split(',') : []
  }

  const sortBy = {
    title: req.query.title || '',
    severity: +req.query.severity || 0,
    createdAt: +req.query.createdAt || 0,
    sortDir: +req.query.sortDir || 0
  }

  bugService
    .query(filterBy, sortBy)
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error(err)
      res.status(400).send('Problem Getting Bugs', err)
    })
})

// POST

app.post('/api/bug', (req, res) => {
  const user = userService.validateToken(req.cookies.loginToken)
  console.log('Cookies:', req.cookies)

  if (!user) {
    return res.status(401).send('Unauthenticated: Please log in to add a bug')
  }

  const bugToSave = {
    title: req.body.title || '',
    description: req.body.description || '',
    severity: +req.body.severity || 0,
    createdAt: +req.body.createdAt || 0,
    labels: req.body.labels || [],
    creator: req.body.creator
  }

  bugService
    .save(bugToSave, user)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error('Cannot add bug', err)
      res.status(400).send('Cannot add bug', err)
    })
})

// PUT

app.put('/api/bug/:bugId', (req, res) => {
  const user = userService.validateToken(req.cookies.loginToken)

  if (!user) {
    return res.status(401).send({ error: 'Unauthenticated: Please log in' })
  }

  const bugToSave = {
    _id: req.params.bugId,
    title: req.body.title || '',
    description: req.body.description || '',
    severity: +req.body.severity || 0,
    createdAt: +req.body.createdAt || 0,
    labels: req.body.labels || [],
    creator: req.body.creator || {}
  }

  bugService
    .save(bugToSave, user)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error('Cannot edit bug', err)
      res.status(400).send({ error: 'Cannot edit bug', details: err })
    })
})

// GET & ID
app.get('/api/bug/:bugId', visitedBugs, (req, res) => {
  const { bugId } = req.params

  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error(err)
      res.status(400).send(err)
    })
})

// DELETE

app.delete('/api/bug/:bugId', (req, res) => {
  const user = userService.validateToken(req.cookies.loginToken)
  const { bugId } = req.params

  bugService
    .remove(bugId, user)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error(err)
      res.status(400).send(err)
    })
})

// LOGS
app.get('/api/logs', (req, res) => {
  const path = process.cwd()
  res.sendFile(path + '/logs/backend.log')
})

// User Routes ------------------------------------

// USER GET

app.get('/api/user', (req, res) => {
  userService
    .query()
    .then((users) => res.send(users))
    .catch((err) => {
      loggerService.error('Cannot load users', err)
      res.status(400).send('Cannot load users')
    })
})

// USER GET & ID

app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params

  userService
    .getById(userId)
    .then((user) => res.send(user))
    .catch((err) => {
      loggerService.error('Cannot load user', err)
      res.status(400).send('Cannot load user')
    })
})

// USER DELETE & ID

app.delete('/api/user/:userId', (req, res) => {
  const { userId } = req.params

  userService
    .remove(userId)
    .then((user) => {
      res.clearCookie('loginToken')
      res.send(user)
    })
    .catch((err) => {
      loggerService.error('Cannot remove user', err)
      res.status(400).send('Cannot remove user', err)
    })
})

// User Auth Routes ------------------------------------

// USER POST SIGNUP

app.post('/api/auth/signup', (req, res) => {
  const credentials = {
    username: req.body.username || '',
    password: req.body.password,
    fullname: req.body.fullname || ''
  }

  userService.save(credentials).then((userCredentials) => {
    if (userCredentials) {
      const loginToken = userService.getLoginToken(userCredentials)
      res.cookie('loginToken', loginToken)
      res.send(userCredentials)
    } else {
      loggerService.error('Cannot signup a user')
      res.status(400).send('Cannot signup a user')
    }
  })
})

// USER POST LOGIN

app.post('/api/auth/login', (req, res) => {
  const credentials = {
    username: req.body.username || '',
    password: req.body.password
  }

  userService.checkLogin(credentials).then((userCredentials) => {
    if (userCredentials) {
      const loginToken = userService.getLoginToken(userCredentials)
      res.cookie('loginToken', loginToken)
      res.send(userCredentials)
    } else {
      loggerService.error('User Cannot login ')
      res.status(400).send('User cannot login ')
    }
  })
})

// USER POST LOGOUT

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('logged-out!')
})

// SERVER PORT LISTENER

// Fallback route
app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () => loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`))

// COOKIES VISIT BUGS MIDDLEWARE FUNCTION
function visitedBugs(req, res, next) {
  const { bugId } = req.params

  let visitedBugs = req.cookies.visitedBugs || []

  if (!visitedBugs.includes(bugId)) {
    visitedBugs.push(bugId)
  }

  if (visitedBugs.length > 3) {
    loggerService.error(`User visit more then 3 bugs ${visitedBugs} `)
    return res.status(401).send('Wait for a bit...')
  }
  res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })
  console.log(`User visited the following bugs: [${visitedBugs}]`)

  next()
}
