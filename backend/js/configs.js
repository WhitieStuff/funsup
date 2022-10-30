/**
 * Main host.
 */
let host = 'host.replaced.com'

/**
 * Connection data for all DBs.
 */
let dbs = {
  1: {
    main: {
      user: 'dbrep',
      db: 'funsupprod'
    },
    log: {
      user: 'dblog1',
      db: 'funsupprod'
    },
    mr: {
      user: 'dblog4',
      db: 'funsupprod'
    },
    loyalty: {
      user: 'dbloyaltyrep',
      db: 'bonussupprod'
    }
  },
  2: {
    main: {
      user: 'dbrep2',
      db: 'funsupprod2'
    },
    log: {
      user: 'db2log2',
      db: 'funsupprod2'
    },
    mr: {
      user: 'db2log4',
      db: 'funsupprod2'
    },
    loyalty: {
      user: 'dbloyalty2rep',
      db: 'bonussupprod2'
    }
  },
  3: {
    main: {
      user: 'dbrep3',
      db: 'funsupprod3'
    },
    log: {
      user: 'db3log1',
      db: 'funsupprod3'
    },
    mr: {
      user: 'db3log3',
      db: 'funsupprod3'
    }
  },
  4: {
    main: {
      user: 'dbrep4',
      db: 'funsupprod4'
    }
  }
}

/**
 * Output source. Postfix may be injected by *execute.js*, so it must contain only one dot before the file extension.
 * If empty, console output will be applied.
 */
let defaultOutputPath = '>> output.txt'
defaultOutputPath = ''

/** Public key for SSH if needed. */
let defaultKeyPath = ''

module.exports = {host, dbs, defaultOutputPath, defaultKeyPath}
