import express from 'express'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'
import { bugService } from './services/bug.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())

// app.get('/', (req, res) => res.send('<h1> Hello </h1>'))
// app.listen(3030, () => console.log('Server ready at port 3030'))

// SERVER HOMEPAGE - All Data (bugs)
app.get('/api/bug', (req, res) => {
  bugService
    .query()
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error(err)
      res.status(500).send(err)
    })
})

// SERVER CRUD SAVE / CREATE - Above ID!
app.get('/api/bug/save', (req, res) => {
  const bugToSave = {
    _id: req.query._id,
    title: req.query.title,
    description: req.query.description,
    severity: +req.query.severity,
    createdAt: +req.query.createdAt
  }

  bugService
    .save(bugToSave)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(500).send('Cannot save bug', err)
    })
})

// SERVER CRUD BY ID
app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params

  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error(err)
      res.status(500).send(err)
    })
})

// SERVER CRUD REMOVE
app.get('/api/bug/:bugId/remove', (req, res) => {
  const { bugId } = req.params

  bugService
    .remove(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error(err)
      res.status(500).send(err)
    })
})

app.get('/visit/:bugId', (req, res) => {
  const bugId = req.params.bugId
  let visitedBugs = req.cookies.visitedBugs || []

  if (!visitedBugs.includes(bugId)) {
    visitedBugs.push(bugId)
  }

  if (visitedBugs.length > 3) {
    return res.status(401).send('Wait for a bit')
  }
  res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })
  console.log(`User visited the following bugs: [${visitedBugs}]`)

  res.send(`You visited bug ${bugId}`)
})

// SERVER LOGG PAGE
app.get('/api/logs', (req, res) => {
  const path = process.cwd()
  res.sendFile(path + '/logs/backend.log')
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
