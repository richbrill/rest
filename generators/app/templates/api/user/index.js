import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import {<% if (passwordSignup) { %> password as passwordAuth,<% } %> master, token } from '../../services/passport'
import { index, showMe, show, create, update<% if (passwordSignup) { %>, updatePassword<% } %>, destroy } from './controller'
import { schema } from './model'
export <%= userApiPascal %>, { schema } from './model'

const router = new Router()
const { email<% if (passwordSignup) { %>, password<% } %>, name, picture, role } = schema.tree

/**
 * @api {get} /<%= userApiKebabs %> Retrieve <%= userApiLowers %>
 * @apiName Retrieve<%= userApiPascal %>s
 * @apiGroup <%= userApiPascal %>
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiUse listParams
 * @apiSuccess {Object[]} <%= userApiKebabs %> List of <%= userApiKebabs %>.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  query(),
  index)

/**
 * @api {get} /<%= userApiKebabs %>/me Retrieve current <%= userApiLower %>
 * @apiName RetrieveCurrent<%= userApiPascal %>
 * @apiGroup <%= userApiPascal %>
 * @apiPermission user
 * @apiParam {String} access_token User access_token.
 * @apiSuccess {Object} <%= userApiCamel %> <%= userApiPascal %>'s data.
 */
router.get('/me',
  token({ required: true }),
  showMe)

/**
 * @api {get} /<%= userApiKebabs %>/:id Retrieve <%= userApiLower %>
 * @apiName Retrieve<%= userApiPascal %>
 * @apiGroup <%= userApiPascal %>
 * @apiPermission public
 * @apiSuccess {Object} <%= userApiCamel %> <%= userApiPascal %>'s data.
 * @apiError 404 <%= userApiPascal %> not found.
 */
router.get('/:id',
  show)

/**
 * @api {post} /<%= userApiKebabs %> Create <%= userApiLower %>
 * @apiName Create<%= userApiPascal %>
 * @apiGroup <%= userApiPascal %>
 * @apiPermission master
 * @apiParam {String} access_token Master access_token.
 * @apiParam {String} email <%= userApiPascal %>'s email.
 <%_ if (passwordSignup) { _%>
 * @apiParam {String{6..}} password <%= userApiPascal %>'s password.
 <%_ } _%>
 * @apiParam {String} [name] <%= userApiPascal %>'s name.
 * @apiParam {String} [picture] <%= userApiPascal %>'s picture.
 * @apiParam {String=user,admin} [role=user] <%= userApiPascal %>'s picture.
 * @apiSuccess (Sucess 201) {Object} <%= userApiCamel %> <%= userApiPascal %>'s data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Master access only.
 * @apiError 409 Email already registered.
 */
router.post('/',
  master(),
  body({ email<% if (passwordSignup) { %>, password<% } %>, name, picture, role }),
  create)

/**
 * @api {put} /<%= userApiKebabs %>/:id Update <%= userApiLower %>
 * @apiName Update<%= userApiPascal %>
 * @apiGroup <%= userApiPascal %>
 * @apiPermission user
 * @apiParam {String} access_token User access_token.
 * @apiParam {String} [name] <%= userApiPascal %>'s name.
 * @apiParam {String} [picture] <%= userApiPascal %>'s picture.
 * @apiSuccess {Object} <%= userApiCamel %> <%= userApiPascal %>'s data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current user or admin access only.
 * @apiError 404 <%= userApiPascal %> not found.
 */
router.put('/:id',
  token({ required: true }),
  body({ name, picture }),
  update)

<%_ if (passwordSignup) {_%>
/**
 * @api {put} /<%= userApiKebabs %>/:id/password Update password
 * @apiName UpdatePassword
 * @apiGroup <%= userApiPascal %>
 * @apiHeader {String} Authorization Basic authorization with email and password.
 * @apiParam {String{6..}} password <%= userApiPascal %>'s new password.
 * @apiSuccess (Success 201) {Object} <%= userApiCamel %> <%= userApiPascal %>'s data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current user access only.
 * @apiError 404 <%= userApiPascal %> not found.
 */
router.put('/:id/password',
  passwordAuth(),
  body({ password }),
  updatePassword)

<%_ } _%>
/**
 * @api {delete} /<%= userApiKebabs %>/:id Delete <%= userApiLower %>
 * @apiName Delete<%= userApiPascal %>
 * @apiGroup <%= userApiPascal %>
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 Admin access only.
 * @apiError 404 <%= userApiPascal %> not found.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
