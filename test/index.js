/* global describe, it, before, after */

require('dotenv').config()
const BugFixes = require('bugfixes') // eslint-disable-line
const mockyeah = require('mockyeah')

const Logging = require('../src/')

describe('Logging Model', () => {
  before(() => {
    mockyeah.post('/log', {
      json: {
        success: true
      }
    })
  })

  after(() => {
    mockyeah.close()
  })

  it('should log item', (done) => {
    let logs = new Logging()
    logs.authyId = process.env.TEST_ACCOUNT_ID
    logs.accountId = process.env.TEST_ACCOUNT_DATA_ID
    logs.action = 'log item'
    logs.content = {
      data: 'log data'
    }
    logs.send((error, result) => {
      if (error) {
        done(Error(error))
      }

      done()
    })
  })
})
