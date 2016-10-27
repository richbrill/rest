import { PasswordReset } from '.'
import { <%= userApiPascal %> } from '../user'

let passwordReset

beforeEach(async () => {
  const <%= userApiCamel %> = await <%= userApiPascal %>.create({ email: 'a@a.com', password: '123456' })
  passwordReset = await PasswordReset.create({ <%= userApiCamel %> })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = passwordReset.view()
    expect(view.token).toBe(passwordReset.token)
    expect(typeof view.<%= userApiCamel %>).toBe('object')
  })

  it('returns full view', () => {
    const view = passwordReset.view(true)
    expect(view.token).toBe(passwordReset.token)
    expect(view.<%= userApiCamel %>).toEqual(passwordReset.<%= userApiCamel %>.view(true))
  })
})
