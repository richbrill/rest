import crypto from 'crypto'
import { <%= userApiPascal %> } from '.'

let <%= userApiCamel %>

beforeEach(async () => {
  <%= userApiCamel %> = await <%= userApiPascal %>.create({ name: 'user', email: 'a@a.com', password: '123456' })
})

describe('set email', () => {
  it('sets name automatically', () => {
    <%= userApiCamel %>.name = ''
    <%= userApiCamel %>.email = 'test@example.com'
    expect(<%= userApiCamel %>.name).toBe('test')
  })

  it('sets picture automatically', () => {
    const hash = crypto.createHash('md5').update(<%= userApiCamel %>.email).digest('hex')
    expect(<%= userApiCamel %>.picture).toBe(`https://gravatar.com/avatar/${hash}?d=identicon`)
  })

  it('changes picture when it is gravatar', () => {
    <%= userApiCamel %>.email = 'b@b.com'
    const hash = crypto.createHash('md5').update(<%= userApiCamel %>.email).digest('hex')
    expect(<%= userApiCamel %>.picture).toBe(`https://gravatar.com/avatar/${hash}?d=identicon`)
  })

  it('does not change picture when it is already set and is not gravatar', () => {
    <%= userApiCamel %>.picture = 'not_gravatar.jpg'
    <%= userApiCamel %>.email = 'c@c.com'
    expect(<%= userApiCamel %>.picture).toBe('not_gravatar.jpg')
  })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = <%= userApiCamel %>.view()
    expect(view).toBeDefined()
    expect(view.id).toBe(<%= userApiCamel %>.id)
    expect(view.name).toBe(<%= userApiCamel %>.name)
    expect(view.picture).toBe(<%= userApiCamel %>.picture)
  })

  it('returns full view', () => {
    const view = <%= userApiCamel %>.view(true)
    expect(view).toBeDefined()
    expect(view.id).toBe(<%= userApiCamel %>.id)
    expect(view.name).toBe(<%= userApiCamel %>.name)
    expect(view.email).toBe(<%= userApiCamel %>.email)
    expect(view.picture).toBe(<%= userApiCamel %>.picture)
    expect(view.createdAt).toEqual(<%= userApiCamel %>.createdAt)
  })
})
<%_ if (passwordSignup) { _%>

describe('authenticate', () => {
  it('returns the <%= userApiLower %> when authentication succeed', async () => {
    expect(await <%= userApiCamel %>.authenticate('123456')).toBe(<%= userApiCamel %>)
  })

  it('returns false when authentication fails', async () => {
    expect(await <%= userApiCamel %>.authenticate('blah')).toBe(false)
  })
})
<%_ } _%>
<%_ if (authServices.length) { _%>

describe('createFromService', () => {
  let service<%= userApiPascal %>

  beforeEach(() => {
    service<%= userApiPascal %> = {
      id: '123',
      name: 'Test Name',
      email: 'test@test.com',
      picture: 'test.jpg'
    }
  })

  ;['<%- authServices.join("', '") %>'].forEach((service) => {
    describe(service, () => {
      beforeEach(() => {
        service<%= userApiPascal %>.service = service
      })

      it('updates <%= userApiLower %> when email is already registered', async () => {
        const updated<%= userApiPascal %> = await <%= userApiPascal %>.createFromService({ ...service<%= userApiPascal %>, email: 'a@a.com' })
        // keep
        expect(updated<%= userApiPascal %>.id).toBe(<%= userApiCamel %>.id)
        expect(updated<%= userApiPascal %>.email).toBe(<%= userApiCamel %>.email)
        // update
        expect(updated<%= userApiPascal %>.name).toBe(service<%= userApiPascal %>.name)
        expect(updated<%= userApiPascal %>.services[service]).toBe(service<%= userApiPascal %>.id)
        expect(updated<%= userApiPascal %>.picture).toBe(service<%= userApiPascal %>.picture)
      })

      it('updates <%= userApiLower %> when service id is already registered', async () => {
        await <%= userApiCamel %>.set({ services: { [service]: service<%= userApiPascal %>.id } }).save()
        const updated<%= userApiPascal %> = await <%= userApiPascal %>.createFromService(service<%= userApiPascal %>)
        // keep
        expect(updated<%= userApiPascal %>.id).toBe(<%= userApiCamel %>.id)
        expect(updated<%= userApiPascal %>.email).toBe(<%= userApiCamel %>.email)
        // update
        expect(updated<%= userApiPascal %>.name).toBe(service<%= userApiPascal %>.name)
        expect(updated<%= userApiPascal %>.services[service]).toBe(service<%= userApiPascal %>.id)
        expect(updated<%= userApiPascal %>.picture).toBe(service<%= userApiPascal %>.picture)
      })

      it('creates a new <%= userApiLower %> when neither service id and email was found', async () => {
        const created<%= userApiPascal %> = await <%= userApiPascal %>.createFromService(service<%= userApiPascal %>)
        expect(created<%= userApiPascal %>.id).not.toBe(<%= userApiCamel %>.id)
        expect(created<%= userApiPascal %>.services[service]).toBe(service<%= userApiPascal %>.id)
        expect(created<%= userApiPascal %>.name).toBe(service<%= userApiPascal %>.name)
        expect(created<%= userApiPascal %>.email).toBe(service<%= userApiPascal %>.email)
        expect(created<%= userApiPascal %>.picture).toBe(service<%= userApiPascal %>.picture)
      })
    })
  })
})
<%_ } _%>
