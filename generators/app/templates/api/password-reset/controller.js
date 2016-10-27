import { success, notFound } from '../../services/response/'
import { sendMail } from '../../services/sendgrid'
import { PasswordReset } from '.'
import { <%= userApiPascal %> } from '../<%= userApiCamel %>'

export const create = ({ bodymen: { body: { email, link } } }, res, next) =>
  <%= userApiPascal %>.findOne({ email })
    .then(notFound(res))
    .then((<%= userApiCamel %>) => <%= userApiCamel %> ? PasswordReset.create({ <%= userApiCamel %> }) : null)
    .then((reset) => {
      if (!reset) return null
      const { <%= userApiCamel %>, token } = reset
      link = `${link.replace(/\/$/, '')}/${token}`
      const content = `
        Hey, ${<%= userApiCamel %>.name}.<br><br>
        You requested a new password for your <%= name %> account.<br>
        Please use the following link to set a new password. It will expire in 1 hour.<br><br>
        <a href="${link}">${link}</a><br><br>
        If you didn't make this request then you can safely ignore this email. :)<br><br>
        &mdash; <%= name %> Team
      `
      return sendMail({ toEmail: email, subject: '<%= name %> - Password Reset', content })
    })
    .then((response) => response ? res.status(response.statusCode).end() : null)
    .catch(next)

export const show = ({ params: { token } }, res, next) =>
  PasswordReset.findOne({ token })
    .populate('<%= userApiCamel %>')
    .then(notFound(res))
    .then((reset) => reset ? reset.view(true) : null)
    .then(success(res))
    .catch(next)

export const update = ({ params: { token }, bodymen: { body: { password } } }, res, next) => {
  return PasswordReset.findOne({ token })
    .populate('<%= userApiCamel %>')
    .then(notFound(res))
    .then((reset) => {
      if (!reset) return null
      const { <%= userApiCamel %> } = reset
      return <%= userApiCamel %>.set({ password }).save()
        .then(() => PasswordReset.remove({ <%= userApiCamel %> }))
        .then(() => <%= userApiCamel %>.view(true))
    })
    .then(success(res))
    .catch(next)
}
