const { Pool } = require('pg')
const config = require('../config/config')
const logger = require('../helper/logger')

// PostgreSQL configuration
const options = config.get('POSTGRESQL')

let pgPool = null

async function getConnection() {
  if (!pgPool) {
    pgPool = new Pool(options)
  }
  return pgPool
}

async function release(client) {
  try {
    client.release()
  } catch (error) {
    logger.error(error)
  }
}

async function query(lines, values = []) {
  const pgPoolCon = await getConnection()
  const pgClient = await pgPoolCon.connect()

  let pgResult = null
  try {
    pgResult = await pgClient.query(lines, values)
  } catch (error) {
    logger.error(`PostgreSQL ERROR ${JSON.stringify(error)}`)
    logger.error(`PostgreSQL QUERY ${lines}`)
  } finally {
    release(pgClient)
  }
  return pgResult
}

function close() {
  return new Promise((resolve, reject) => {
    try {
      if (pgPool) {
        pgPool.end(() => {
          logger.info('PostgreSQL pool closed.')
          resolve({ result: 'Close PostgreSQL Success' })
        })
      } else {
        resolve({ result: 'There is no connection PostgreSQL' })
      }
    } catch (e) {
      logger.error(JSON.stringify(e))
      reject(new Error('Close PostgreSQL Failed'))
    }
  })
}

module.exports = {
  query,
  close,
}
