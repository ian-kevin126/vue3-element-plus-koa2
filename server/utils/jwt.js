const crypto = require('crypto')
const { JWT_SECRET, EXPIRES_IN } = require('../config/index')
const jwt = require('jsonwebtoken')

module.exports = {
  createHash: (value) => {
    const hmac = crypto.createHash('sha256', JWT_SECRET)
    hmac.update(value)
    return hmac.digest('hex')
  },
  sign(result) {
    return jwt.sign(
      {
        _id: result._id,
        name: result.name,
      },
      JWT_SECRET,
      config.expiresIn
    )
  },
  verify(ctx, decodedToken, token) {
    let ret = true
    try {
      const payload = jwt.verify(token, JWT_SECRET)
      console.log(payload)
      if (payload) ret = false
    } catch (err) {
      console.log(err.name)
    }
    return ret
  },
}
