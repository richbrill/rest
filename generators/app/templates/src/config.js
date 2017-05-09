/* eslint-disable no-unused-vars */
import path from 'path'
import _ from 'lodash'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.load({
    path: path.join(__dirname, '../.env'),
    sample: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9000,
    host: process.env.IP || localhost,
    <%_ if (typeof passwordReset !== 'undefined' && passwordReset) { _%>
    defaultEmail: 'no-reply@<%= slug %>.com',
    <%_ } _%>
    <%_ if (typeof sendgridKey !== 'undefined' && sendgridKey) { _%>
    sendgridKey: requireProcessEnv('SENDGRID_KEY'),
    <%_ } _%>
    masterKey: requireProcessEnv('MASTER_KEY'),
    <%_ if (typeof generateAuthApi !== 'undefined' && generateAuthApi) { _%>
    jwtSecret: requireProcessEnv('JWT_SECRET'),
    <%_ } _%>
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    }
  },
  test: {
    mongo: {
      uri: 'mongodb://localhost/<%= slug %>-test',
      options: {
        debug: false
      }
    }
  },
  development: {
    mongo: {
      uri: 'mongodb://localhost/<%= slug %>-dev',
      options: {
        debug: true
      }
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost/<%= slug %>'
    }
  }
}

module.exports = _.merge(config.all, config[config.all.env])
export default module.exports
