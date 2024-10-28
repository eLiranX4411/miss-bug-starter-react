import fs from 'fs'
import { utilService } from './util.service.js'

const cars = utilService.readJsonFile('data/car.json')

export const carService = {
    query,
    getById,
    remove,
    save
}


function query() {
    return Promise.resolve(cars)
}

function getById(carId) {
    const car = cars.find(car => car._id === carId)
    if (!car) return Promise.reject('Cannot find car - ' + carId)
    return Promise.resolve(car)
}

function remove(carId) {
    const carIdx = cars.findIndex(car => car._id === carId)
    if (carIdx < 0) return Promise.reject('Cannot find car - ' + carId)
    cars.splice(carIdx, 1)
    return _saveCarsToFile()
}

function save(carToSave) {

    if (carToSave._id) {
        const carIdx = cars.findIndex(car => car._id === carToSave._id)
        cars[carIdx] = carToSave
    } else {
        carToSave._id = utilService.makeId()
        cars.unshift(carToSave)
    }

    return _saveCarsToFile().then(() => carToSave)
}

function _saveCarsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(cars, null, 4)
        fs.writeFile('data/car.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}