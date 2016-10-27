import crypto from 'crypto'
<%_ if (passwordSignup) { _%>
import bcrypt from 'bcrypt'
<%_ if (authServices.length) { _%>
import randtoken from 'rand-token'
<%_ } _%>
<%_ } _%>
import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
<%_ if (passwordSignup) { _%>
import { env } from '../../config'
<%_ } _%>

<%_ if (passwordSignup) { _%>
const compare = require('bluebird').promisify(bcrypt.compare)
<%_ } _%>
const roles = ['user', 'admin']

const <%= userApiCamel %>Schema = new Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  <%_ if (passwordSignup) { _%>
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  <%_ } _%>
  name: {
    type: String,
    index: true,
    trim: true
  },
  <%_ if (authServices.length) { _%>
  services: {
    <%_ authServices.forEach(function (service, i) { _%>
    <%= service %>: String<%- i !== authServices.length - 1 ? ',' : '' %>
    <%_ }) _%>
  },
  <%_ } _%>
  role: {
    type: String,
    enum: roles,
    default: 'user'
  },
  picture: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

<%= userApiCamel %>Schema.path('email').set(function (email) {
  if (!this.picture || this.picture.indexOf('https://gravatar.com') === 0) {
    const hash = crypto.createHash('md5').update(email).digest('hex')
    this.picture = `https://gravatar.com/avatar/${hash}?d=identicon`
  }

  if (!this.name) {
    this.name = email.replace(/^(.+)@.+$/, '$1')
  }

  return email
})

<%_ if (passwordSignup) { _%>
<%= userApiCamel %>Schema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  /* istanbul ignore next */
  const rounds = env === 'test' ? 1 : 9

  bcrypt.hash(this.password, rounds, (err, hash) => {
    /* istanbul ignore next */
    if (err) return next(err)
    this.password = hash
    next()
  })
})

<%_ } _%>
<%= userApiCamel %>Schema.methods = {
  view (full) {
    let view = {}
    let fields = ['id', 'name', 'picture']

    if (full) {
      fields = [...fields, 'email', 'createdAt']
    }

    fields.forEach((field) => { view[field] = this[field] })

    return view
  }<%_ if (passwordSignup) { _%>,

  authenticate (password) {
    return compare(password, this.password).then((valid) => valid ? this : false)
  }
  <%_ } _%>
}

<%= userApiCamel %>Schema.statics = {
  <%_ if (authServices.length) { _%>
  roles,

  createFromService ({ service, id, email, name, picture }) {
    return this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] })
      .then((<%= userApiCamel %>) => {
        if (<%= userApiCamel %>) {
          <%= userApiCamel %>.services[service] = id
          <%= userApiCamel %>.name = name
          <%= userApiCamel %>.picture = picture
          return <%= userApiCamel %>.save()
        } else {
          <%_ if (passwordSignup) { _%>
          const password = randtoken.generate(16)
          <%_ } _%>
          return this.create({ services: { [service]: id }, email<% if (passwordSignup) { %>, password<% } %>, name, picture })
        }
      })
  }
  <%_ } else { _%>
  roles
  <%_ } _%>
}

<%= userApiCamel %>Schema.plugin(mongooseKeywords, { paths: ['email', 'name'] })

module.exports = mongoose.model('<%= userApiPascal %>', <%= userApiCamel %>Schema)
export default module.exports
