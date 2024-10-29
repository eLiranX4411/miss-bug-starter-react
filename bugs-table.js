import { utilService } from './services/util.service.js'
import PDFDocument from 'pdfkit-table'
import fs from 'fs'

// init document
let doc = new PDFDocument({ margin: 30, size: 'A4' })

// connect to a write stream
doc.pipe(fs.createWriteStream('public/data/bugs.pdf'))

createPdf(doc).then(() => doc.end()) // close document

function createPdf() {
  const bugs = utilService.readJsonFile('public/data/bugs.json')
  const rows = bugs.map(({ _id, title, description, severity, createdAt }) => [
    _id || 'N/A',
    title || 'N/A',
    description || 'N/A',
    severity || 'N/A',
    createdAt || 'N/A'
  ])

  const table = {
    title: 'Bugs',
    headers: ['ID', 'Title', 'Description', 'Severity', 'Created At'],
    rows: rows
  }
  return doc.table(table, { columnsSize: [80, 150, 200, 100, 100] })
}
