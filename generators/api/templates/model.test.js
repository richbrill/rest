import { <%= pascal %> } from '.'
<%_ if (storeUser) { _%>
import { <%= userApiPascal %> } from '../<%= userApiKebab %>'
<%_ } _%>

let <%= storeUser ? userApiCamel + ', ' : '' %><%= camel %>

beforeEach(async () => {
  <%_ if (storeUser) { _%>
  <%= userApiCamel %> = await <%= userApiPascal %>.create({ email: 'a@a.com', password: '123456' })
  <%_ } _%>
  <%_ if (modelFields.length) { _%>
  <%= camel %> = await <%= pascal %>.create({ <%-
    storeUser
    ? userField === userApiCamel ? userApiCamel + ', ' : userField + ': ' + userApiCamel + ', '
    : ''
  %><%- modelFields.map(function (field) {
    return field + ": 'test'";
  }).join(', ') %> })
  <%_ } else { _%>
  <%= camel %> = await <%= pascal %>.create({<%-
    storeUser
    ? userField === userApiCamel ? userApiCamel : ' ' + userField + ': ' + userApiCamel + ' '
    : ''
  %>})
  <%_ } _%>
})

describe('view', () => {
  it('returns simple view', () => {
    const view = <%= camel %>.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(<%= camel %>.id)
    <%_ if (storeUser) { _%>
    expect(typeof view.<%= userField %>).toBe('object')
    expect(view.<%= userField %>.id).toBe(<%= userApiCamel %>.id)
    <%_ } _%>
    <%_ modelFields.forEach(function (field) { _%>
    expect(view.<%= field %>).toBe(<%= camel %>.<%= field %>)
    <%_ }) _%>
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = <%= camel %>.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(<%= camel %>.id)
    <%_ if (storeUser) { _%>
    expect(typeof view.<%= userField %>).toBe('object')
    expect(view.<%= userField %>.id).toBe(<%= userApiCamel %>.id)
    <%_ } _%>
    <%_ modelFields.forEach(function (field) { _%>
    expect(view.<%= field %>).toBe(<%= camel %>.<%= field %>)
    <%_ }) _%>
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
