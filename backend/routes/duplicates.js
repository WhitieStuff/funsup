const express = require('express')
const router = express.Router()

const getCommandSSH = require('../js/getCommandSSH')
const { dbs } = require('../js/configs')
const execute = require('../js/execute')

router.post('/', async (req, res) => {
  let node = req.body.node || 1

  let users = req.body.users || []
  if (!users.length)
    return res
      .status(404)
      .json({ result: 'Failed', message: 'Users not found' })

  /**
   * Must be like '>> output.txt'.
   */
  let outputPath = ''

  let userFunsup = dbs[node].main.user || 'dbrep'
  let userLoyalty = dbs[node].loyalty.user || 'dbloyaltyrep'

  let dbFunsup = dbs[node].main.db || 'funreplacedprod'
  let dbLoyalty = dbs[node].loyalty.db || 'bonusreplacedprod'

  let sshFunsup = getCommandSSH(userFunsup)
  let sshLoyalty = getCommandSSH(userLoyalty)

  let queries = [
    {
      ssh: sshFunsup,
      query: `USE ${dbFunsup}; SELECT ID, IDRef, IDUser, Type, Value, Count FROM UserDuplicates WHERE IDUser IN (${users.toString()});`
    },
    {
      ssh: sshFunsup,
      query: `USE ${dbFunsup}; SELECT 'Funsup', ID, IDUser, DuplicateLevel FROM UserDuplicateLevels WHERE IDUser IN (${users.toString()});`
    },
    {
      ssh: sshLoyalty,
      query: `USE ${dbLoyalty}; SELECT 'Loyalty', IDUser, DuplicateLevel FROM Loyalty WHERE IDUser IN (${users.toString()});`
    }
  ]

  let data = {
    duplicates: await execute(queries[0].ssh, queries[0].query, outputPath),
    funsup: await execute(queries[1].ssh, queries[1].query, outputPath),
    loyalty: await execute(queries[2].ssh, queries[2].query, outputPath)
  }

  res.json({ status: 'OK', data })
})

router.get('/', (req, res) => {
  res.json({ status: 'OK', message: req.baseUrl })
})

module.exports = router
