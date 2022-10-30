addEventListener('DOMContentLoaded', e => {
  document
    .querySelector('#duplicates .section__input-field-button')
    .addEventListener('click', removeParent)
  document
    .querySelector('#duplicates .section__input-field')
    .addEventListener('focus', removeError)
  document
    .querySelector('#duplicates-user-import')
    .addEventListener('focus', removeError)

  document
    .querySelector('#duplicates-add')
    .addEventListener('click', e => addFieldDuplicates(e.target))

  document
    .querySelector('#duplicates-execute')
    .addEventListener('click', checkDuplicates)
  document
    .querySelector('#duplicates-reset')
    .addEventListener('click', resetDuplicates)
  document.querySelector('#duplicates-import').addEventListener('click', e => {
    document.querySelector('#modalDuplicates').classList.add('visible')
  })
  document
    .querySelector('#duplicates-modal-cancel')
    .addEventListener('click', e => {
      document.querySelector('#modalDuplicates').classList.remove('visible')
    })
  document
    .querySelector('#duplicates-modal-import')
    .addEventListener('click', duplicatesUsersImport)

  let modals = document.querySelectorAll('.modal-wrapper')
  modals.forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target != e.currentTarget) return
      e.target.classList.remove('visible')
    })
  })

  let modalCloses = document.querySelectorAll('.modal__close')
  modalCloses.forEach(close => {
    close.addEventListener('click', e => {
      if (e.target != e.currentTarget) return
      let id = e.target.getAttribute('for')
      document.querySelector(`#${id}`).classList.remove('visible')
    })
  })
})

function removeParent(e) {
  e.target.parentNode.parentNode.removeChild(e.target.parentNode)
}

function addFieldDuplicates(button, value = '') {
  let newField = document.createElement('div')
  newField.classList.add('section__input-field-wrapper')

  let newInput = document.createElement('input')
  newInput.classList.add('section__input-field')
  newInput.setAttribute('type', 'text')
  newInput.setAttribute('placeholder', 'User ID')
  newInput.addEventListener('click', removeError)
  newInput.value = value

  let newButton = document.createElement('button')
  newButton.classList.add('section__input-field-button')
  newButton.innerHTML = '—'
  newButton.addEventListener('click', removeParent)

  newField.appendChild(newInput)
  newField.appendChild(newButton)

  button.parentNode.insertBefore(newField, button)
}

function removeError(e) {
  e.target.classList.remove('bad')
}

function addError(element) {
  element.classList.add('bad')
}

function resetDuplicates() {
  let fields = document.querySelectorAll(
    '#duplicates .section__input-field-wrapper'
  )
  fields.forEach(field => field.parentNode.removeChild(field))

  document.querySelector('#duplicates-add').click()
}

function checkDuplicates() {
  let users = []
  let ok = true

  let fields = document.querySelectorAll('#duplicates .section__input-field')
  fields.forEach(field => {
    let value = field.value.trim()
    if (!value.match(/^\d+$/g)) return fail(field)
    users.push(value)
  })

  function fail(field) {
    ok = false
    addError(field)
  }

  if (ok) executeDuplicates(users)
}

async function executeDuplicates(users = []) {
  let previousUsers = document.querySelector('#duplicates-users')
  if (previousUsers) previousUsers.parentNode.removeChild(previousUsers)
  let previousOutput = document.querySelector('#duplicates-output')
  if (previousOutput) previousOutput.parentNode.removeChild(previousOutput)

  if (!users.length) return
  let node = 2
  document.querySelectorAll('.section__radio').forEach(radio => {
    if (radio.checked) node = radio.value.split('-')[1]
  })
  let data = { node, users }
  let result = await performPost('http://localhost:3000/duplicates', data)
  displayDuplicates(result)
}

let longestFieldsDuplicatesFunsup = { ID: 2, IDUser: 6, DuplicateLevel: 14 }
let longestFieldsDuplicatesLoyaty = { IDUser: 6, DuplicateLevel: 14 }
let longestFieldsDuplicates = {
  ID: 2,
  IDRef: 5,
  IDUser: 6,
  Type: 4,
  Value: 5,
  Count: 5
}

function displayDuplicates(data) {
  let { duplicates, funsup, loyalty } = data
  let duplicatesSection = document.querySelector('#duplicates')

  let levels = {
    0: {
      name: 'Default',
      screen: 'Default'
    },
    1: {
      name: 'Browser',
      screen: 'Browser'
    },
    2: {
      name: 'IP',
      screen: 'IP'
    },
    4: {
      name: 'Password',
      screen: 'Password'
    },
    8: {
      name: 'Email',
      screen: 'Email'
    },
    16: {
      name: 'Payer',
      screen: 'Payer ID'
    },
    32: {
      name: 'Login Browser',
      screen: 'LoginBrowser'
    },
    64: {
      name: 'LastLoginIP',
      screen: 'Last Login IP'
    },
    128: {
      name: 'IBAN',
      screen: 'IBAN'
    },
    256: {
      name: 'Phone',
      screen: 'Phone'
    },
    512: {
      name: 'NameLastNameAddress',
      screen: 'Name + Address'
    }
  }

  let duplicatesUsers = document.createElement('form')
  duplicatesUsers.classList.add('section__results-users')
  duplicatesUsers.id = 'duplicates-users'

  funsup.result.forEach(row => {
    let userID = row.IDUser
    let duplicateLevel = parseInt(row.DuplicateLevel)

    for (key in longestFieldsDuplicatesFunsup) {
      longestFieldsDuplicatesFunsup[key] =
        row[key].length > longestFieldsDuplicatesFunsup[key]
          ? row[key].length
          : longestFieldsDuplicatesFunsup[key]
    }

    let userRow = document.createElement('div')
    userRow.classList.add('section__user-row')
    duplicatesUsers.appendChild(userRow)

    let userRowID = document.createElement('div')
    userRowID.classList.add('user-row__id')
    userRowID.innerHTML = userID
    userRow.appendChild(userRowID)

    for (level in levels) {
      let label = levels[level].screen
      let checked = level == 8 || level == 256 ? true : false
      if (duplicateLevel & level)
        displayOneDuplicate(userRow, userID, level, label, checked)
    }
  })

  function displayOneDuplicate(row, userID, type, label, checked) {
    let rowUser = document.createElement('div')
    rowUser.classList.add('user-row__duplicate')

    let rowUserCheckbox = document.createElement('input')
    rowUserCheckbox.classList.add('user-row__checkbox')
    rowUserCheckbox.type = 'checkbox'
    rowUserCheckbox.name = `duplicates-${userID}`
    rowUserCheckbox.id = `duplicates-${userID}-${type}`
    rowUserCheckbox.checked = checked
    rowUser.appendChild(rowUserCheckbox)

    let rowUserLabel = document.createElement('label')
    rowUserLabel.classList.add('user-row__label')
    rowUserLabel.setAttribute('for', `duplicates-${userID}-${type}`)
    rowUserLabel.innerHTML = label
    rowUser.appendChild(rowUserLabel)

    let isMatch = false
    loyalty.result.forEach(loyaltyRow => {
      let loyaltyLevel = parseInt(loyaltyRow.DuplicateLevel)

      for (key in longestFieldsDuplicatesLoyaty) {
        longestFieldsDuplicatesLoyaty[key] =
          loyaltyRow[key].length > longestFieldsDuplicatesLoyaty[key]
            ? loyaltyRow[key].length
            : longestFieldsDuplicatesLoyaty[key]
      }

      if (userID != loyaltyRow.IDUser) return
      for (level in levels) {
        if (loyaltyLevel & level & type) isMatch = true
      }
    })

    if (!isMatch) rowUser.classList.add('user-row__duplicate_bad')

    row.appendChild(rowUser)
  }

  duplicates.result.forEach(duplicateRow => {
    for (key in longestFieldsDuplicates) {
      longestFieldsDuplicates[key] =
        duplicateRow[key].length > longestFieldsDuplicates[key]
          ? duplicateRow[key].length
          : longestFieldsDuplicates[key]
    }
  })

  duplicatesSection.appendChild(duplicatesUsers)

  let calcButtons = document.createElement('div')
  calcButtons.classList.add('section__buttons')
  let calcButton = document.createElement('button')
  calcButton.classList.add('button')
  calcButton.id = 'duplicates-calc'
  calcButton.innerHTML = 'Calculate'
  calcButtons.appendChild(calcButton)
  duplicatesUsers.appendChild(calcButtons)

  calcButton.addEventListener('click', e => {
    e.preventDefault()
    let previousOutput = document.querySelector('#duplicates-output')
    if (previousOutput) previousOutput.parentNode.removeChild(previousOutput)

    let output = ''

    let outputDuplicatesNeeded = false
    let queryDataDuplicates = []

    let outputDuplicatesHeader = 'UserDuplicates:\n╔'
    let outputDuplicatesFooter = `\n╚`
    for (key in longestFieldsDuplicates) {
      outputDuplicatesHeader += `═${key.padEnd(
        longestFieldsDuplicates[key],
        '═'
      )}═╤`
      outputDuplicatesFooter += `═${'═'.padEnd(
        longestFieldsDuplicates[key],
        '═'
      )}═╧`
    }
    outputDuplicatesHeader = outputDuplicatesHeader.replace(/.$/, '╗')
    outputDuplicatesFooter = outputDuplicatesFooter.replace(/.$/, '╝')

    duplicates.result.forEach(duplicateRow => {
      let currentLevel = 0
      for (level in levels) {
        currentLevel =
          duplicateRow.Type == levels[level].name
            ? parseInt(level)
            : currentLevel
      }
      let currentCheckbox = document.querySelector(
        `#duplicates-${duplicateRow.IDUser}-${currentLevel}`
      )
      if (!currentCheckbox || !currentCheckbox.checked) return

      if (duplicateRow.IDRef > 0) queryDataDuplicates.push(duplicateRow.ID)

      let outputDuplicatesRow = '\n║'
      for (key in longestFieldsDuplicates) {
        if (key == 'Type' || key == 'Value') {
          outputDuplicatesRow += ` ${duplicateRow[key].padEnd(
            longestFieldsDuplicates[key],
            ' '
          )} │`
        } else {
          outputDuplicatesRow += ` ${duplicateRow[key].padStart(
            longestFieldsDuplicates[key],
            ' '
          )} │`
        }
      }
      if (!outputDuplicatesNeeded) {
        output += outputDuplicatesHeader
        outputDuplicatesNeeded = true
      }

      outputDuplicatesRow = outputDuplicatesRow.replace(/.$/, '║')
      output += outputDuplicatesRow
    })
    if (outputDuplicatesNeeded) output += outputDuplicatesFooter

    let outputFunsupNeeded = false
    let queryDataFunsup = {}

    let outputFunsupHeader = '\n\nFunsup levels:\n╔'
    let outputFunsupFooter = `\n╚`
    for (key in longestFieldsDuplicatesFunsup) {
      outputFunsupHeader += `═${key.padEnd(
        longestFieldsDuplicatesFunsup[key],
        '═'
      )}═╤`
      outputFunsupFooter += `═${'═'.padEnd(
        longestFieldsDuplicatesFunsup[key],
        '═'
      )}═╧`
    }
    outputFunsupHeader = outputFunsupHeader.replace(/.$/, '╗')
    outputFunsupFooter = outputFunsupFooter.replace(/.$/, '╝')

    funsup.result.forEach(funsupRow => {
      let showCurrentUser = false
      for (level in levels) {
        let currentCheckbox = document.querySelector(
          `#duplicates-${funsupRow.IDUser}-${level}`
        )
        if (!currentCheckbox || !currentCheckbox.checked) continue

        if (currentCheckbox.checked) showCurrentUser = true
        queryDataFunsup[level] = queryDataFunsup[level]
          ? queryDataFunsup[level]
          : []
        queryDataFunsup[level].push(funsupRow.IDUser)
      }

      if (!showCurrentUser) return

      let outputFunsupRow = '\n║'
      for (key in longestFieldsDuplicatesFunsup) {
        outputFunsupRow += ` ${funsupRow[key].padStart(
          longestFieldsDuplicatesFunsup[key],
          ' '
        )} │`
      }
      if (!outputFunsupNeeded) {
        output += outputFunsupHeader
        outputFunsupNeeded = true
      }
      outputFunsupRow = outputFunsupRow.replace(/.$/, '║')
      output += outputFunsupRow
    })
    if (outputFunsupNeeded) output += outputFunsupFooter

    let outputLoyaltyNeeded = false
    let queryDataLoyalty = {}

    let outputLoyaltyHeader = '\n\nLoyalty levels:\n╔'
    let outputLoyaltyFooter = `\n╚`
    for (key in longestFieldsDuplicatesLoyaty) {
      outputLoyaltyHeader += `═${key.padEnd(
        longestFieldsDuplicatesLoyaty[key],
        '═'
      )}═╤`
      outputLoyaltyFooter += `═${'═'.padEnd(
        longestFieldsDuplicatesLoyaty[key],
        '═'
      )}═╧`
    }
    outputLoyaltyHeader = outputLoyaltyHeader.replace(/.$/, '╗')
    outputLoyaltyFooter = outputLoyaltyFooter.replace(/.$/, '╝')

    loyalty.result.forEach(loyaltyRow => {
      let showCurrentUser = false
      for (level in levels) {
        let currentCheckbox = document.querySelector(
          `#duplicates-${loyaltyRow.IDUser}-${level}`
        )
        if (!currentCheckbox || !currentCheckbox.checked) continue

        if (currentCheckbox.checked) showCurrentUser = true
        queryDataLoyalty[level] = queryDataLoyalty[level]
          ? queryDataLoyalty[level]
          : []
        queryDataLoyalty[level].push(loyaltyRow.IDUser)
      }

      if (!showCurrentUser) return

      let outputLoyaltyRow = '\n║'
      for (key in longestFieldsDuplicatesLoyaty) {
        outputLoyaltyRow += ` ${loyaltyRow[key].padStart(
          longestFieldsDuplicatesLoyaty[key],
          ' '
        )} │`
      }
      if (!outputLoyaltyNeeded) {
        output += outputLoyaltyHeader
        outputLoyaltyNeeded = true
      }
      outputLoyaltyRow = outputLoyaltyRow.replace(/.$/, '║')
      output += outputLoyaltyRow
    })
    if (outputLoyaltyNeeded) output += outputLoyaltyFooter

    console.log(output)
    let newOuput = document.createElement('div')
    newOuput.classList.add('section__results-output')
    newOuput.id = 'duplicates-output'

    let newOuputDuplicates = document.createElement('pre')
    newOuputDuplicates.classList.add('section__output')
    newOuputDuplicates.innerHTML = output
    newOuput.appendChild(newOuputDuplicates)

    if (output.length) duplicatesSection.appendChild(newOuput)

    let node = 2
    document.querySelectorAll('.section__radio').forEach(radio => {
      if (radio.checked) node = radio.value.split('-')[1]
    })
    node = node > 1 ? node : ''

    let query = ''
    if (queryDataDuplicates.length) {
      let queryDuplicates = `UPDATE funprod${node}.UserDuplicates SET IDRef=0, Count=0 WHERE ID IN (${queryDataDuplicates.toString()}) LIMIT ${
        queryDataDuplicates.length
      };\n`
      query += queryDuplicates
    }

    let queryFunsup = ''
    let queryLoyalty = ''
    for (level in levels) {
      if (queryDataFunsup[level] && queryDataFunsup[level].length)
        queryFunsup += `UPDATE funprod${node}.UserDuplicateLevels SET DuplicateLevel = DuplicateLevel - ${level} WHERE IDUser IN (${queryDataFunsup[
          level
        ].toString()}) LIMIT ${queryDataFunsup[level].length};\n`
      if (queryDataLoyalty[level] && queryDataLoyalty[level].length)
        queryLoyalty += `UPDATE bonusprod${node}.Loyalty SET DuplicateLevel = DuplicateLevel - ${level} WHERE IDUser IN (${queryDataLoyalty[
          level
        ].toString()}) LIMIT ${queryDataLoyalty[level].length};\n`
    }

    if (queryFunsup.length) query += '\n' + queryFunsup
    if (queryLoyalty.length) query += '\n' + queryLoyalty
    console.log(query)

    let newOuputQueryWrapper = document.createElement('pre')
    newOuputQueryWrapper.classList.add('section__output')

    let newOuputQuery = document.createElement('code')
    newOuputQuery.innerHTML = query
    newOuputQuery.classList.add('language-sql')
    newOuputQueryWrapper.appendChild(newOuputQuery)
    if (query.length) newOuput.appendChild(newOuputQueryWrapper)

    document.querySelectorAll('pre code').forEach(el => {
      hljs.highlightElement(el)
    })
  })
}

async function performPost(url = '', data = {}) {
  if (!url) return { message: 'No URL provided' }
  console.log(`POSTing to ${url}`)
  console.log(data)
  let duplicatesSection = document.querySelector('#duplicates')
  showLoading(duplicatesSection)
  try {
    let response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',

      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    })
    if ((await response.status) == 200) {
      hideLoading(duplicatesSection)
      console.log(response.status)
      let data = await response.json()
      console.log(data)
      return data.data
    } else {
      hideLoading(duplicatesSection)
      console.log(response.status)
      return false
    }
  } catch (e) {
    hideLoading(duplicatesSection)
    console.log(e)
    return false
  }
}

function showLoading(section) {
  let loading = document.createElement('div')
  loading.classList.add('section__loading')
  loading.innerHTML = 'Loading'
  let counter = document.createElement('div')
  counter.innerHTML = 1
  loading.appendChild(counter)
  section.appendChild(loading)
  setInterval(() => {
    counter.innerHTML++
  }, 1000)
}

function hideLoading(section) {
  let loading = section.querySelector('.section__loading')
  section.removeChild(loading)
}

function duplicatesUsersImport() {
  let textarea = document.querySelector('#duplicates-user-import')
  let data = textarea.value
  if (!data.length) return addError(textarea)

  let values = data.split('\n')
  let keep = document.querySelector('#duplicates-keep-data').checked
  if (!keep) {
    document.querySelector('#duplicates-reset').click()
    let field = document.querySelector(
      '#duplicates .section__input-field-wrapper'
    )
    field.parentNode.removeChild(field)
  }
  let buttonAdd = document.querySelector('#duplicates-add')
  values.forEach(value => {
    addFieldDuplicates(buttonAdd, value)
  })

  return document.querySelector('#duplicates-modal-cancel').click()
}
