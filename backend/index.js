const fs = require('fs')
const execute = require('./js/execute')
const createQuery = require('./js/createQuery')
const { dbs } = require('./js/configs')
const getTimeFormatted = require('./js/getFormattedTime')
const getNextTime = require('./js/getNextTime')
const getTableDate = require('./js/getTableDate')
const log = require('./js/log')
const express = require('express')
const app = express()

const duplicates = require('./routes/duplicates')

app.use(express.json())
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.get('/', async (req, res) => {
  // let result = await prepareNextQuery()
  res.json({result: 'OK', message: 'OK'})
})

app.use('/duplicates', duplicates)

app.listen(3000)

// /** Time to search from. */
// let timeNext = initialTime

// /**
//  * Change configs.js first.
//  */

// /** 
//  * Prepares the query and run its execution.
//  */
// async function prepareNextQuery() {
//   let query = createQuery()
//   // let timeNextFormatted = getTimeFormatted(timeNext)
//   let output_postfix = ''

//   let result = await execute(query, output_postfix)
//   // if (performed) shiftTime()
//   console.log(result.result)
//   log(`Query performed: ${result.performed}`)
//   // return prepareNextQuery()

//   return result.result
// }

// function shiftTime() {
//   timeNext = getNextTime(timeNext)
//   let timeNextFormatted = getTimeFormatted(timeNext)
//   log(`Searched up to ${timeNextFormatted}`)
// }

