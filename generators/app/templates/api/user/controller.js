import _ from 'lodash'
import { success, notFound } from '../../services/response/'
import { <%= userApiPascal %> } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  <%= userApiPascal %>.find(query, select, cursor)
    .then((<%= userApiCamels %>) => <%= userApiCamels %>.map((<%= userApiCamel %>) => <%= userApiCamel %>.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  <%= userApiPascal %>.findById(params.id)
    .then(notFound(res))
    .then((<%= userApiCamel %>) => <%= userApiCamel %> ? <%= userApiCamel %>.view() : null)
    .then(success(res))
    .catch(next)

export const showMe = ({ user }, res) =>
  res.json(user.view(true))

export const create = ({ bodymen: { body } }, res, next) =>
  <%= userApiPascal %>.create(body)
    .then((<%= userApiCamel %>) => <%= userApiCamel %>.view(true))
    .then(success(res, 201))
    .catch((err) => {
      /* istanbul ignore else */
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'email',
          message: 'email already registered'
        })
      } else {
        next(err)
      }
    })

export const update = ({ bodymen: { body }, params, user }, res, next) =>
  <%= userApiPascal %>.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isAdmin = user.role === 'admin'
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other <%= userApiCamel %>\'s data'
        })
        return null
      }
      return result
    })
    .then((<%= userApiCamel %>) => <%= userApiCamel %> ? _.merge(<%= userApiCamel %>, body).save() : null)
    .then((<%= userApiCamel %>) => <%= userApiCamel %> ? <%= userApiCamel %>.view(true) : null)
    .then(success(res))
    .catch(next)

<%_ if (passwordSignup) { _%>
export const updatePassword = ({ bodymen: { body }, params, user }, res, next) =>
  <%= userApiPascal %>.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: 'password',
          message: 'You can\'t change other <%= userApiCamel %>\'s password'
        })
        return null
      }
      return result
    })
    .then((<%= userApiCamel %>) => <%= userApiCamel %> ? <%= userApiCamel %>.set({ password: body.password }).save() : null)
    .then((<%= userApiCamel %>) => <%= userApiCamel %> ? <%= userApiCamel %>.view(true) : null)
    .then(success(res))
    .catch(next)

<%_ } _%>
export const destroy = ({ params }, res, next) =>
  <%= userApiPascal %>.findById(params.id)
    .then(notFound(res))
    .then((<%= userApiCamel %>) => <%= userApiCamel %> ? <%= userApiCamel %>.remove() : null)
    .then(success(res, 204))
    .catch(next)
