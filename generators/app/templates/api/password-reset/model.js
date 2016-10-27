import mongoose, { Schema } from 'mongoose'
import { uid } from 'rand-token'

const passwordResetSchema = new Schema({
  <%= userApiCamel %>: {
    type: Schema.ObjectId,
    ref: '<%= userApiPascal %>',
    index: true
  },
  token: {
    type: String,
    unique: true,
    index: true,
    default: () => uid(32)
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600
  }
})

passwordResetSchema.methods = {
  view (full) {
    return {
      <%= userApiCamel %>: this.<%= userApiCamel %>.view(full),
      token: this.token
    }
  }
}

module.exports = mongoose.model('PasswordReset', passwordResetSchema)
export default module.exports
