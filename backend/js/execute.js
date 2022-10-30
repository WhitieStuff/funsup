const { exec } = require('child_process')
const { defaultOutputPath} = require('./configs')
const log = require('./log')

/**
 * Executes the query in powershell via SSH.
 * @param {string} query Query to be executed.
 * @param {string} outpuPostfix Postfix to be added before the output file extension.
 * @returns Result status. True if executed.
 */
async function execute(ssh, query, outputPath) {
  /** Output file with the provided postfix. Remains empty if not set in *configs.js.* */
  let newOutputPath = outputPath || defaultOutputPath || ''
  /** Command to be run in powershell. */
  newOutputPath = ''
  let command = `echo "${query}" | ${ssh} ${newOutputPath}`
  log(`The following command will be executed: \n${command}`)

  try {
    const { stdout, stderr } = await exec(command, { shell: 'powershell.exe' })
    let fullData = ''

    var result = new Promise((resolve, reject) => {
      stderr.on('data', function (error) {
        log(`Error: ${error}`)
        reject({performed: false, result: error})
      })
      stdout.on('data', function (data) {
        fullData += data
        // resolve(true)
      })
      stdout.on('close', () => {
        // log(fullData)
        let rows = []
        let lines = fullData.split(/\r\n|\r|\n/g)
        let header = lines[0].split(/\t/g)

        for (let i = 1; i < lines.length - 1; i++) {
          let line = lines[i].split(/\t/g)

          let row = {}
          for (let j = 0; j < line.length; j++) {
            row[header[j]]=line[j]
          }
          rows.push(row)
        }
        resolve({performed: true, result: rows})
      })
    })

  } catch (e) {
    log(`Error: ${e}`)
  }

  return result
}

module.exports = execute
