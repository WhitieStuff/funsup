/** API ID set in configs.js */
let { api } = require('./configs')
// const log = require('./log')
const getTimeFormatted = require('./getFormattedTime')
const getNextTime = require('./getNextTime')
const getTableDate = require('./getTableDate')

/**
 * Creates the SQL query.
 * @param {Date} timeStart Seach from.
 * @returns SQL query to be executed.
 */
function createQuery() {
  // /** Search until. */
  // let timeEnd = getNextTime(timeStart)
  // /** Formatted 'search from' time. */
  // let timeStartFormatted = getTimeFormatted(timeStart)
  // /** Formatted 'search until' time. */
  // let timeEndFormatted = getTimeFormatted(timeEnd)
  // /** Table name postfix. */
  // let date = getTableDate(timeStartFormatted)

  /** SQL Query. All double quotes " must be double-escaped with \`".
   * First one for the powershell and the second one is for SQL.
   */
  let query = `
  select 
    *
  from
    Api
  where
    Name like 'replaced'
  limit 10;
  `
  
  return query
}

module.exports = createQuery
