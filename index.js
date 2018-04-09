'use strict'

const uuid = require('uuid/v5')
const BugFixes = require('bugfixes')
const requestPromise = require('request-promise')

const bugFunctions = BugFixes.functions

class Logging {
  set authyId (authyId) {
    this._authyId = authyId
  }
  get authyId () {
    return this._authyId
  }

  set requestId (requestId) {
    this._requestId = requestId
  }
  get requestId () {
    return this._requestId
  }

  set action (action) {
    this._action = action
  }
  get action () {
    return this._action
  }

  set content (content) {
    this._content = content
  }
  get content () {
    return this._content
  }

  generateId (authyId) {
    this.authyId = authyId

    let generateTime = new Date()
    generateTime = generateTime.toISOString()

    const generatedUUID = uuid(process.env.LOGGING_GEN + generateTime, uuid.DNS)
    const id = uuid(generatedUUID + this.authyId, uuid.DNS)

    this.requestId = id

    return id
  }

  send (callback) {
    let self = this

    let dataSet = {
      requestId: self.requestId,
      action: self.action,
      authyId: self.authyId,
      content: self.content
    }

    BugFixes.log('Data', dataSet)

    const loggingOptions = {
      method: 'POST',
      uri: process.env.LOGGING_URL + '/log',
      headers: {
        'X-API-KEY': process.env.LOGGING_KEY,
        'X-API-SECRET': process.env.LOGGING_SECRET
      },
      data: dataSet,
      json: true
    }

    requestPromise(loggingOptions).then((body) => {
      if (bugFunctions.checkIfDefined(body.success)) {
        if (body.success === true) {
          if (process.env.LOGGING_SHOW_STATUS === true) {
            BugFixes.info('Logging Worked', body)
          }

          if (callback) {
            return callback(null, {
              logged: true
            })
          }
        } else {
          throw new Error('Logging Failed')
        }
      }
    }).catch((err) => {
      if (err.length) {
        if (process.env.LOGGING_SHOW_STATUS === true) {
          BugFixes.error('Logging Error', Error(err))
        }

        if (callback) {
          return callback(err)
        }
      }
    })
  }
}

module.exports = Logging
