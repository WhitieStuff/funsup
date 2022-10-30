let { host, defaultKeyPath } = require('./configs')

/**
 * Returns the SSH command.
 * @param {object} params Params of the SSH connection.
 * @param {object} params Params of the SSH connection.
 * @param {object} params Params of the SSH connection.
 * @returns SSH command.
 */
function getCommandSSH(user, port, keyPath) {
  /** Public key for SSH if needed. */
  let newKeyPath = keyPath || defaultKeyPath || ''
  /** SSH port. */
  let newPort = port || '22'
  /** SSH user. */
  let newUser = user || 'dbrep'
  /** SSH connection command. */
  let ssh = `ssh ${newKeyPath} -T ${newUser}@${host} -p ${newPort}`

  return ssh
}

module.exports = getCommandSSH
